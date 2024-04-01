const express = require('express')
const { Inventory, userStat } = require('../../db/models');
const { requireAuth, authorization } = require('../../utils/auth');

router = express.Router();



// get route : items in the inventory (includes gear)
// * to be continued with receiving more inventory data
router.get('/', requireAuth, async (req, res) => {

	const inventory = await Inventory.findAll(
		{
			where: {
				userId: req.user.id
			}
		}
	)
	{ !inventory } {
		res
			// .status(204)
			.json({
				message: "Inventory is empty"
			})
	}



	res.json(inventory);
});



module.exports = router;
