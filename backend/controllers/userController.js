require('dotenv').config();

const User = require('../models/userModel');
const {
	throwCustomError,
	checkUserSession,
	createToken,
} = require('../functions/functions');

/* Route functions */

// User login account
const userLogin = async (req, res) => {
	const { email, password } = req.body;

	await User.login(email, password)
		.then((user) => {
			if (!user) {
				throwCustomError(500, 'Something went wrong! Please try again.');
			}

			req.session.regenerate(function (err) {
				if (err) {
					throwCustomError(500, 'Something went wrong! Please try again.');
				}
			})

			const { password, ...userContext } = user._doc;
			req.session.isAuth = true;
			req.session.token = createToken(userContext._id);
			req.session.user = userContext;
			req.session.save(function(err) {
				if (err) {
					throwCustomError(500, 'Something went wrong! Please try again.');
				}
				res.status(200).json({ success: true, user: { ...userContext } });
			});
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// User register account
const userRegister = async (req, res) => {
	const { email, password, username } = req.body;

	await User.register(email, password, username)
		.then((user) => {
			if (!user) {
				throwCustomError(500, 'Something went wrong! Please try again.');
			}

			req.session.regenerate(function (err) {
				if (err) {
					throwCustomError(500, 'Something went wrong! Please try again.');
				}
			})
			const { password, ...userContext } = user._doc;
			req.session.user = userContext;
			req.session.isAuth = true;
			req.session.save();
			res.status(200).json({ success: true, user: { ...userContext } });
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// User refresh session
const userRefresh = async (req, res) => {
	if (req.session.isAuth) {
		req.session.reload(function (err) {
			if (err) {
				throwCustomError(500, 'Something went wrong! Please try again.');
			}
		})
		const user = req.session.user;
		req.session.save();
		return res.status(200).json({ success: true, user: user });
	}
	res.status(200).json({ success: false });
};

// User update account
const userUpdate = async (req, res) => {
	const { _id, email, currentPassword, newPassword, username } = req.body;

	try {
		checkUserSession(req.session, _id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	await User.updateUser(_id, email, currentPassword, newPassword, username)
		.then((updatedUser) => {
			if (!updatedUser) {
				throwCustomError(500, 'Something went wrong! Please try again.');
			}
			
			req.session.regenerate(function (err) {
				if (err) {					
					throwCustomError(500, 'Something went wrong! Please try again.');
				}
			})
			req.session.isAuth = true;
			req.session.user = updatedUser._doc;
			req.session.save();
			res.status(200).json({ success: true, user: { ...updatedUser._doc } });
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// User delete account
const userDelete = async (req, res) => {
	const { _id, email, password } = req.body;

	try {
		checkUserSession(req.session, _id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	await User.deleteUser(_id, email, password)
		.then((response) => {
			if (!response) {
				throwCustomError(500, 'Something went wrong! Please try again.');
			}

			req.session.isAuth = false;
			req.session.user = null;
			req.session.destroy(function (err) {
				if (err) {
					throwCustomError(500, 'Something went wrong! Please try again.');
				}
			});
			res.clearCookie('user_session');
			res.status(200).json({ success: true });
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// User logout account
const userLogout = async (req, res) => {
	const { _id } = req.body;

	try {
		checkUserSession(req.session, _id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	req.session.isAuth = false;
	req.session.user = null;
	req.session.destroy(function (err) {
		if (err) {
			throwCustomError(500, 'Something went wrong! Please try again.');
		}
	});
	res.clearCookie('user_session');
	res.status(200).json({ success: true });
};

module.exports = {
	userLogin,
	userRegister,
	userRefresh,
	userUpdate,
	userDelete,
	userLogout,
};
