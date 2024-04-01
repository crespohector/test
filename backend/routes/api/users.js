const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, userStat } = require('../../db/models');



const router = express.Router();



const validateSignup = [
	check('email')
		.exists({ checkFalsy: true })
		.isEmail()
		.withMessage('Please provide a valid email.'),
	check('username')
		.exists({ checkFalsy: true })
		.isLength({ min: 6})
		.withMessage('Please provide a username with at least 6 characters.'),
	check('username')
		.exists({ checkFalsy: true })
		.isLength({ max: 20 })
		.withMessage('Please provide a username with less than 20 characters.'),
	check('username')
		.not()
		.isEmail()
		.withMessage('Username cannot be an email.'),
	check('username')
		.isAlphanumeric()
		.withMessage('Username cannot include any symbols.'),
	check('displayName')
		.exists({ checkFalsy: true })
		.isLength({ min: 6 })
		.withMessage('Please provide a display name with at least 6 characters.'),
	check('displayName')
		.exists({ checkFalsy: true })
		.isLength({ max: 30 })
		.withMessage('Please provide a display name of less than 30 characters.'),
	check('password')
		.exists({ checkFalsy: true })
		.isLength({ min: 6 })
		.withMessage('Password must be 6 characters or more.'),
	handleValidationErrors
];


// Sign up
router.post(
	'/',
	validateSignup,
	async (req, res) => {
		const { email, password, username, displayName, heroClass = 'Warrior' || 'Mage'} = req.body;
		const hashedPassword = bcrypt.hashSync(password);
		const user = await User.create({
			email, username, password: hashedPassword
			, displayName
		});

		// prompt the user to choose between warrior or mage
		const heroType = await userStat.create({
			heroClass,
			userId: user.id
		})
		const safeUser = {
			id: user.id,
			username: user.username,
			displayName: user.displayName,
			email: user.email,
			heroClass: heroType.heroClass
		};

		await setTokenCookie(res, safeUser);

		return res.json({
			user: safeUser
		});
	}
);



module.exports = router;
