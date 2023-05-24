const mongoose = require('mongoose');
const { throwCustomError } = require('../functions/functions');

// Define sheet schema
const Schema = mongoose.Schema;

// Sheet records schema
const recordsSchema = new Schema({
	type: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	transaction: {
		type: String,
		required: true,
	},
	reference: {
		type: String,
	},
	amount: {
		type: mongoose.Schema.Types.Decimal128,
		required: true,
	},
});

// Sheet budgets schema
const budgetsSchema = new Schema({
	type: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	current: {
		type: mongoose.Schema.Types.Decimal128,
		required: true,
		default: 0,
	},
	target: {
		type: mongoose.Schema.Types.Decimal128,
		required: true,
	},
	start: {
		type: Date,
		required: true,
	},
	end: {
		type: Date,
		required: true,
	},
});

const sheetSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		isStarred: {
			type: Boolean,
			default: false,
		},
		balance: {
			type: mongoose.Schema.Types.Decimal128,
			required: true,
			default: 0.0,
		},
		records: [
			{
				type: recordsSchema,
				default: {},
			},
		],
		budgets: [
			{
				type: budgetsSchema,
				default: {},
			},
		],
	},
	{ timestamps: true }
);

/* Define sheet schema static methods */

// Compute sheet balance from sheet records
sheetSchema.statics.updateBalance = async function (sheet_id, user_id) {
	try {
		const recordBalance = await this.aggregate([
			{
				$match: {
					$and: [
						{
							_id: new mongoose.Types.ObjectId(sheet_id),
						},
						{
							user_id: new mongoose.Types.ObjectId(user_id),
						},
					],
				},
			},
			{
				$unwind: '$records',
			},
			{
				$group: {
					_id: null,
					debitAmount: {
						$sum: {
							$cond: [
								{ $eq: ['$records.type', 'debit'] },
								'$records.amount',
								0,
							],
						},
					},
					creditAmount: {
						$sum: {
							$cond: [
								{ $eq: ['$records.type', 'credit'] },
								'$records.amount',
								0,
							],
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					balance: {
						$subtract: ['$debitAmount', '$creditAmount'],
					},
				},
			},
		]);

		if (recordBalance.length === 0) {
			return await this.findById(sheet_id);
		}

		return await this.findById(sheet_id)
			.updateOne(
				{ user_id: user_id },
				{
					balance: parseFloat(recordBalance[0].balance),
				}
			)
			.then((res) => {
				if (res.modifiedCount > 0 && res.acknowledged) {
					return this.findById(sheet_id);
				}
			});
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

// Get all sheets for *user_id* static method
sheetSchema.statics.getAllSheets = async function (_id) {
	if (!_id) {
		throw new Error('User ID missing! Please try again.');
	}

	try {
		const sheets = await this.find({ user_id: _id }).exec();
		if (!sheets) {
			throw new Error('Could not find sheets for this user! Please try again.');
		}

		return sheets;
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

// Get sheet static method
sheetSchema.statics.getSheet = async function (_id) {
	if (!_id) {
		throw new Error('Sheet ID missing! Please try again.');
	}

	try {
		const sheet = await this.findById(_id);
		if (!sheet) {
			throw new Error('Could not find this sheet! Please try again.');
		}

		return sheet;
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

// Add new sheet static method
sheetSchema.statics.addSheet = async function (user_id, title) {
	if (!user_id) {
		throw new Error('User ID missing! Please try again.');
	}

	try {
		const newSheet = await this.create({ title: title, user_id: user_id });
		if (!newSheet) {
			throw new Error('Could not add a new sheet! Please try again.');
		}

		return newSheet;
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

// Update sheet static method
sheetSchema.statics.updateSheet = async function (
	_id,
	title,
	user_id,
	isStarred
) {
	if (!_id) {
		throw new Error('Sheet ID missing! Please try again.');
	}
	if (!user_id) {
		throw new Error('User ID missing! Please try again.');
	}

	try {
		const updatedSheet = await this.findById(_id)
			.updateOne(
				{ user_id: user_id },
				{
					title: title,
					isStarred: isStarred,
				}
			)
			.then((res) => {
				if (res.modifiedCount > 0 && res.acknowledged) {
					return this.updateBalance(_id, user_id);
				}
			});

		if (!updatedSheet) {
			throw new Error('Could not update sheet! Please try again.');
		}

		return updatedSheet;
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

// Delete sheet static method
sheetSchema.statics.deleteSheet = async function (_id, user_id) {
	if (!_id) {
		throw new Error('Sheet ID missing! Please try again.');
	}
	if (!user_id) {
		throw new Error('User ID missing! Please try again.');
	}

	try {
		const sheetDeleted = await this.findById(_id).deleteOne({
			user_id: user_id,
		});

		if (sheetDeleted) {
			return true;
		}
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

// Add new sheet record static method
sheetSchema.statics.addRecord = async function (
	user_id,
	sheet_id,
	type,
	date,
	transaction,
	reference,
	amount
) {
	if (!sheet_id) {
		throw new Error('Sheet ID missing! Please try again.');
	}
	if (!user_id) {
		throw new Error('User ID missing! Please try again.');
	}

	try {
		const newRecord = await this.findById(sheet_id)
			.updateOne(
				{ user_id: user_id },
				{
					$push: {
						records: {
							$each: [
								{
									type: type,
									date: date,
									transaction: transaction,
									reference: reference,
									amount: amount,
								},
							],
							$sort: { date: 1 },
						},
					},
				}
			)
			.then((res) => {
				if (res.modifiedCount > 0 && res.acknowledged) {
					return this.updateBalance(sheet_id, user_id);
				}
			});

		if (!newRecord) {
			throw new Error('Could not add record! Please try again.');
		}
		return newRecord;
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

// Update sheet record static method
sheetSchema.statics.updateRecord = async function (
	user_id,
	sheet_id,
	_id,
	type,
	date,
	transaction,
	reference,
	amount
) {
	if (!_id) {
		throw new Error('Record ID missing! Please try again.');
	}
	if (!sheet_id) {
		throw new Error('Sheet ID missing! Please try again.');
	}
	if (!user_id) {
		throw new Error('User ID missing! Please try again.');
	}

	try {
		const updatedRecord = await this.findById(sheet_id)
			.updateOne(
				{ user_id: user_id },
				{
					$set: {
						'records.$[element]': {
							type: type,
							date: date,
							transaction: transaction,
							reference: reference,
							amount: amount,
						},
					},
				},
				{ arrayFilters: [{ 'element._id': _id }] }
			)
			.then((res) => {
				if (res.modifiedCount > 0 && res.acknowledged) {
					return this.updateBalance(sheet_id, user_id);
				}
			});

		if (!updatedRecord) {
			throw new Error('Could not update record! Please try again.');
		}

		return updatedRecord;
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

// Delete sheet record static method
sheetSchema.statics.deleteRecord = async function (user_id, sheet_id, _id) {
	if (!_id) {
		throw new Error('Record ID missing! Please try again.');
	}
	if (!sheet_id) {
		throw new Error('Sheet ID missing! Please try again.');
	}
	if (!user_id) {
		throw new Error('User ID missing! Please try again.');
	}

	try {
		const deletedRecord = await this.findById({ _id: sheet_id })
			.updateOne(
				{ user_id: user_id },
				{
					$pull: {
						records: { _id: _id },
					},
				}
			)
			.then((res) => {
				if (res.modifiedCount > 0 && res.acknowledged) {
					return this.updateBalance(sheet_id, user_id);
				}
			});

		if (!deletedRecord) {
			throw new Error('Could not add record! Please try again.');
		}

		return deletedRecord;
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

// Add new sheet budget static method
sheetSchema.statics.addBudget = async function (
	user_id,
	sheet_id,
	type,
	name,
	current,
	target,
	start,
	end
) {
	if (!user_id) {
		throw new Error('User ID missing! Please try again.');
	}
	if (!sheet_id) {
		throw new Error('Sheet ID missing! Please try again.');
	}

	try {
		const addedBudget = await this.findById(sheet_id)
			.updateOne(
				{ user_id: user_id },
				{
					$push: {
						budgets: {
							$each: [
								{
									type: type,
									name: name,
									current: current,
									target: target,
									start: start,
									end: end,
								},
							],
							$sort: 1,
						},
					},
				}
			)
			.then((res) => {
				if (res.modifiedCount > 0 && res.acknowledged) {
					return this.findById(sheet_id);
				}
			});

		if (!addedBudget) {
			throw new Error('Could not add budget! Please try again.');
		}

		return addedBudget;
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

// Update sheet budget static method
sheetSchema.statics.updateBudget = async function (
	user_id,
	sheet_id,
	_id,
	type,
	name,
	current,
	target,
	start,
	end
) {
	if (!_id) {
		throw new Error('Budget ID missing! Please try again.');
	}
	if (!user_id) {
		throw new Error('User ID missing! Please try again.');
	}
	if (!sheet_id) {
		throw new Error('Sheet ID missing! Please try again.');
	}

	try {
		const updatedBudget = await this.findById(sheet_id)
			.updateOne(
				{ user_id: user_id },
				{
					$set: {
						'budgets.$[element]': {
							type: type,
							name: name,
							current: current,
							target: target,
							start: start,
							end: end,
						},
					},
				},
				{ arrayFilters: [{ 'element._id': _id }] }
			)
			.then((res) => {
				if (res.modifiedCount > 0 && res.acknowledged) {
					return this.findById(sheet_id);
				}
			});

		if (!updatedBudget) {
			throw new Error('Could not update budget! Please try again.');
		}

		return updatedBudget;
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

// Delete sheet budget static method
sheetSchema.statics.deleteBudget = async function (user_id, sheet_id, _id) {
	if (!_id) {
		throw new Error('Budget ID missing! Please try again.');
	}
	if (!user_id) {
		throw new Error('User ID missing! Please try again.');
	}
	if (!sheet_id) {
		throw new Error('Sheet ID missing! Please try again.');
	}

	try {
		const deletedBudget = await this.findById(sheet_id)
			.updateOne(
				{ user_id: user_id },
				{
					$pull: {
						budgets: { _id: _id },
					},
				}
			)
			.then((res) => {
				if (res.modifiedCount > 0 && res.acknowledged) {
					return this.findById(sheet_id);
				}
			});

		if (!deletedBudget) {
			throw new Error('Could not delete budget! Please try again.');
		}

		return deletedBudget;
	} catch (err) {
		throwCustomError(500, err.message);
	}
};

module.exports = mongoose.model('Sheet', sheetSchema);
