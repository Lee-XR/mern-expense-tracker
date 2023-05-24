const jwt = require('jsonwebtoken');

// Throw error with custom status code and error message
const throwCustomError = (status, message) => {
	const error = new Error(message);
	error.status = status;
	throw error;
};

// Create new user jwt token
const createToken = (user_id) => {
	try {
		return jwt.sign({ _id: user_id }, process.env.SECRET_KEY, {
			expiresIn: '600000',
		});
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

// Verify user jwt token
const verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.SECRET_KEY);
	} catch (err) {
		throw Error(err.message);
	}
};

// Check if user session is auth
const checkUserSession = (userSession, user_id) => {
	if (!userSession) {
		throwCustomError(401, 'Session user is missing.');
	}

	throwCustomError(403, userSession);

	if (!userSession.isAuth || !userSession.token) {
		throwCustomError(401, '1 Session user is unauthenticated.');
	}

	const { _id } = verifyToken(userSession.token);
	if (!_id || _id !== user_id) {
		throwCustomError(401, 'Session user is unauthorised.');
	}
};

module.exports = {
	throwCustomError,
	checkUserSession,
	createToken,
	verifyToken,
};
