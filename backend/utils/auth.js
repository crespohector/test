const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Task } = require('../db/models');
const { check } = require('express-validator');

const { secret, expiresIn } = jwtConfig;


// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
	// Create the token.
	const safeUser = {
		id: user.id,
		username: user.username,
		displayName: user.displayName,
		email: user.email,
	};
	const token = jwt.sign(
		{ data: safeUser },
		secret,
		{ expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
	);

	const isProduction = process.env.NODE_ENV === "production";

	// Set the token cookie
	res.cookie('token', token, {
		maxAge: expiresIn * 1000, // maxAge in milliseconds
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction && "Lax"
	});

	return token;
};


const restoreUser = (req, res, next) => {
	// token parsed from cookies
	const { token } = req.cookies;
	req.user = null;

	return jwt.verify(token, secret, null, async (err, jwtPayload) => {
		if (err) {
			return next();
		}

		try {
			const { id } = jwtPayload.data;
			req.user = await User.findByPk(id, {
				attributes: {
					include: ['email', 'createdAt', 'updatedAt']
				}
			});
		} catch (e) {
			res.clearCookie('token');
			return next();
		}

		if (!req.user) res.clearCookie('token');

		return next();
	});
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
	if (req.user) return next();

	const err = new Error('Authentication required');
	err.title = 'Authentication required';
	err.errors = { message: 'Authentication required' };
	err.status = 401;
	return next(err);
};


const authorization = async function (req, res, next) {
	const { taskId, userId, checklistId } = req.params;


	if (taskId) {
		const task = await Task.findByPk(taskId);

		if (!task) {
			return res
				.status(404)
				.json({
					message: null || "Task could not be found"
				})
		}
		if (!checklistId) {
			return res
				.status(404)
				.json({
					message: null || "Checklist could not be found"
				})
		}
		if (req.user.id !== task.userId) handleNotAuthorized(res)
	}
	next()
};


function handleNotAuthenticated(res) {
	const err = new Error('Forbidden');
	if (process.env.NODE_ENV !== 'production') {
		err.title = 'Authentication required';
		err.errors = {
			message: 'Authentication required',
		};
	}
	err.status = 403
	return res
		.status(403)
		.json({
			message: "Permission denied"
		})
}

function handleNotAuthorized(res) {
	const err = new Error('Forbidden');
	if (process.env.NODE_ENV !== 'production') {
		err.title = 'Authorization required'
		err.errors = {
			message: 'Authorization required'
		}
	}
	err.status = 401
	return res
		.status(401)
		.json({
			message: 'Permission denied'
		})
}




module.exports = { setTokenCookie, restoreUser, requireAuth, authorization };
