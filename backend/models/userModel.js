const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { throwCustomError } = require('../functions/functions');

// Define user schema
const Schema = mongoose.Schema;
const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
);

/* Define user schema static methods */

// Login static method
userSchema.statics.login = async function (email, password) {
	// Input validation
	if (!email || !password)
		throw new Error('Fields cannot be empty. Please enter all fields.');
	if (!validator.isEmail(email))
		throw new Error('Invalid email. Please enter a valid email.');

	// Check if user exists
	const user = await this.findOne({ email });
	if (!user)
		throw new Error('Incorrect email. Please enter your correct email.');

	// Check if password is correct
	const passwordCorrect = await bcrypt.compare(password, user.password);
	if (!passwordCorrect)
		throw new Error('Incorrect password. Please enter your correct password.');

	return user;
};

// Register static method
userSchema.statics.register = async function (email, password, username) {
	// Input validation
	if (!email || !password || !username)
		throw new Error('Fields cannot be empty. Please enter all fields.');
	if (!validator.isEmail(email))
		throw new Error('Invalid email. Please enter a valid email.');

	// Check if email taken
	const emailTaken = await this.findOne({ email });
	if (emailTaken)
		throw new Error('This email is already taken. Please enter another email');

	// Generate salt & hash to encrypt password
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	const user = await this.create({ email, password: hash, username });

	return user;
};

// Update user static method
userSchema.statics.updateUser = async function (
	_id,
	email,
	currentPassword,
	newPassword,
	username
) {
	// Input validation
	if (!_id) throw new Error('User ID missing! Please try again.');
	if (email && !validator.isEmail(email))
		throw new Error('Invalid email. Please enter a valid email.');

	// Check if user exist
	const user = await this.findById({ _id });
	if (!user)
		throw new Error('User does not exist! Cannot update user account.');

	// Check if password is correct
	const passwordCorrect = await bcrypt.compare(currentPassword, user.password);
	if (!passwordCorrect)
		throw new Error(
			'Incorrect email/password! Please enter the correct details.'
		);

	// Generate salt & hash to encrypt password
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(newPassword, salt);

	try {
		const updated = await this.findByIdAndUpdate(
			{ _id },
			{
				email,
				password: newPassword ? hash : currentPassword,
				username,
			}
		);

		if (updated) {
			return await this.findById({ _id }, '-password');
		}
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

// Delete user static method
userSchema.statics.deleteUser = async function (_id, email, password) {
	// Input validation
	if (!_id || !email || !password)
		throw new Error('Fields cannot be empty. Please enter all fields.');
	if (!validator.isEmail(email))
		throw new Error('Invalid email. Please enter a valid email.');

	// Check if user exist
	const user = await this.findById({ _id });
	if (!user)
		throw new Error('User does not exist! Cannot delete user account.');

	// Validate user details
	const emailCorrect = email === user.email ? true : false;
	const passwordCorrect = await bcrypt.compare(password, user.password);
	if (!emailCorrect || !passwordCorrect)
		throw new Error(
			'Incorrect email/password! Please enter the correct details.'
		);

	// Delete user account permanently
	try {
		const userDeleted = await this.findByIdAndDelete({ _id });
		if (userDeleted) {
			return true;
		}
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

module.exports = mongoose.model('User', userSchema);
