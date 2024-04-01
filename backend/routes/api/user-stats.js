const express = require('express')
const { userStat, Inventory, Stat, Task } = require('../../db/models');
const { requireAuth, authorization } = require('../../utils/auth');
const stat = require('../../db/models/stat');

router = express.Router();




// remove user stat w/ gear (removal of gear to see stats)
router.delete('/:userId/unequip/:statId', requireAuth, async (req, res) => {

	const { userId, statId } = req.params;

	try {
		const itemToRemove = await Inventory.findByPk(statId, {
			where: {
				userId
			}
		})
		if (!itemToRemove) {
			return res
				.status(404)
				.json({
					error: "Item not found"
				})
		}
		const statUser = await userStat.findByPk(itemToRemove.userId)
		if (!user) {
			return res
				.status(404)
				.json({
					error: "User not found"
				})
		}
		// Revert stat application
		const description = itemToRemove.description;
		const statBooster = description.match(/Grants a (\d+)% increase in (.+):/);
		if (statBooster) {



			const percentageApplicator = parseInt(statBooster[1]);
			const statName = statBooster[2];
			const currStatVal = statUser[statName.toLowerCase()];
			const statDecrease = Math.round((currStatVal * percentageApplicator / 100));

			statUser[statName.toLowerCase()] -= statDecrease;

			await user.save();
		}
		// THEN DESTROYYYYY
		await itemToRemove.destroy()
		return res
			.status(200)
			.json({
				message: "Item(s)successfully removed"
			});

	} catch (err) {
		res
			.status(500)
			.json({ error: "Internal service error" });
	};

})

//get all user stat (with gear or skill additions based on equipment equipped)
router.get('/:userId/equipped', requireAuth, async (req, res) => {

	const { userId } = req.params;
	const equippedItems = await Inventory.findAll({
		where: {
			userId,
			[Sequelize.Op.or]: [{ gear: true }, { wep: true }],
			equipped: true
		},
		attributes: {
			exclude: ['statBoost']
		}
	})



	if (!equippedItems || equippedItems.equipped === false && (equippedItems.gear === false && equippedItems.wep === false || equippedItems.length === 0)) {
		return res
			.json({
				message: "There are no gear items or weapons equipped right now"
			})
	}

	await equippedItems.forEach(equip => {
		// parse description to find out stat
		const description = equip.description;
		const statBooster = description.match(/Grants a (\d+)% increase in (.+):/);
		if (statBooster) {



			const percentageApplicator = parseInt(statBooster[1]);
			const statName = statBooster[2];

			// update the users stats based on above info extrapolated
			const userStatUpdate = userStat.findAll({
				where: {
					userId
				}
			}) // cannot personally await

			for (let user of userStatUpdate) {
				//apply stats
				const currStatVal = user[statName.toLowerCase()]
				const statIncrease = Math.round((currStatVal * percentageApplicator) / 100)
				user[statName.toLowerCase()] += statIncrease

				user.save(); // cannot personally await
			}
		}

	});

	res.json({
		message: "Equipped gear items / weapon items successful"
	});
});



//route where an inventory item potion is used it will apply to the depleted health
router.get('/:userId/potion', requireAuth, async (req, res) => {
	const { userId } = req.params;
	const potionItem = await Inventory.findAll({
		where: {
			userId,
			healthBoost: true
		},
		attributes: {
			exclude: ['gear', 'wep', 'statBoost', 'equipped']
		}
	})
	if (potionItem.length === 0) {
		return res
			.status(404)
			.json({
				error: "No health potions available"
			})
	}


	const userStatus = await userStat.findByPk(userId)


	const currHealth = userStatus.health;

	//if currHealth is less than 100%
	if (currHealth < 100) {
		// use available health potions
		const potionItem = potionItems[0]

		//add the 40 since this is the only potion available
		userStatus.health = Math.min(currHealth + 40, 100) // the 100 is to ensure that the health does not exceed 100%

		await userStatus.save();
		//potion must be destroyed
		await potionItem.destroy();
		return res
			.status(200)
			.json({
				message: "Health potion used successfully"
			})
	} else {
		return res
			.status(400)
			.json({
				error: "Health status is already full"
			})
	}
});






// Get userStats for a user upon task completion
// see the put route for the put request of task
router.get('/:userId', async (req, res) => {
	//! this may end up hanging, do not test solely on the backend

	const { userId } = req.params;
	const { completed } = req.body;
	const taskMark = await Task.findAll({
		where: {
			userId
		}
	})
	try {
		const userExp = await userStat.findOne({
			where: { userId }
		});




		// Determine current level
		const level = userExp.getLevel();
		// Calculating exp gain and updating health upon task completion (or failure to complete)
		if (completed) {
			taskMark.completed = completed
			userExp.calcHpAndExp(completed);
			// Save changes to userStats
			await userExp.save();
			res
				.status(200)
				.json({ userExp, level });
		}

	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: 'Internal server error' });
	}
});




//get all user stat (without gear or skill additions [from userStats])

router.get('/', requireAuth, async (req, res) => {
	// without a user stat we need to create one as a default, though this is still ultimately a "GET"

	const statsUser = await userStat.findAll({
		where: {
			userId: req.user.id
		},
		attributes: {
			exclude: [
				'createdAt', 'updatedAt'
			]
		}
	});

	// Check if the user's stats exist
	if (statsUser.health === 0 || statsUser.length === 0) {
		// if not, create the userStat with their default values
		const statsForUser = await userStat.create({ userId: req.user.id });

		// send res that the userStat has been successfully created
		return res
			.status(201)
			.json(statsForUser)

	} else {
		// if they already exist show them
		return res
			.status(200)
			.json(statsUser)
	}
});



//? get all user stat with gear including any items that have been used (specifically best for battle route later on)














//? removal of user stat with bonuses (removal of bonuses applied to user stat from items)












module.exports = router;
