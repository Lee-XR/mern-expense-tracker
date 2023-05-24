const Sheet = require('../models/sheetModel');
const {
	checkUserSession,
} = require('../functions/functions');

/* Route functions */

// Display all sheets for user
const sheetsDisplayAll = async (req, res) => {
	const { _id } = req.body;
	try {
		checkUserSession(req.session, _id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	await Sheet.getAllSheets(_id)
		.then((sheets) => {
			if (sheets) {
				res.status(200).json({ success: true, sheets: sheets });
			}
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// Display individual sheet
const sheetDisplay = async (req, res) => {
	const { _id, user_id } = req.body;

	return res.status(400).json({session: req.session});

	try {
		// req.session.reload(function (err) {
		// 	if (err) {
		// 		throwCustomError(500, 'Something went wrong! Please try again.');
		// 	}
		// });
		checkUserSession(req.session, user_id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	await Sheet.getSheet(_id)
		.then((sheet) => {
			if (sheet) {
				res.status(200).json({ success: true, sheet: sheet });
			}
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// Add new sheet
const sheetAdd = async (req, res) => {
	const { user_id, title } = req.body;

	try {
		checkUserSession(req.session, user_id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	await Sheet.addSheet(user_id, title)
		.then((sheet) => {
			if (sheet) {
				res.status(200).json({ success: true, sheet: sheet });
			}
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// Update a sheet
const sheetUpdate = async (req, res) => {
	const { _id, title, user_id, isStarred } = req.body;

	try {
		checkUserSession(req.session, user_id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	await Sheet.updateSheet(_id, title, user_id, isStarred)
		.then((sheet) => {
			if (sheet) {
				res.status(200).json({ success: true, sheet: sheet });
			}
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// Delete a sheet
const sheetDelete = async (req, res) => {
	const { _id, user_id } = req.body;

	try {
		checkUserSession(req.session, user_id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	await Sheet.deleteSheet(_id, user_id)
		.then((response) => {
			if (response) {
				res.status(200).json({ success: true });
			}
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// Add new sheet record
const recordAdd = async (req, res) => {
	const { user_id, sheet_id, type, date, transaction, reference, amount } =
		req.body;

	try {
		checkUserSession(req.session, user_id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	await Sheet.addRecord(
		user_id,
		sheet_id,
		type,
		date,
		transaction,
		reference,
		amount
	)
		.then((sheet) => {
			if (sheet) {
				res.status(200).json({ success: true, sheet: sheet });
			}
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// Update sheet record
const recordUpdate = async (req, res) => {
	const { user_id, sheet_id, _id, type, date, transaction, reference, amount } =
		req.body;

	try {
		checkUserSession(req.session, user_id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	await Sheet.updateRecord(
		user_id,
		sheet_id,
		_id,
		type,
		date,
		transaction,
		reference,
		amount
	)
		.then((sheet) => {
			if (sheet) {
				res.status(200).json({ success: true, sheet: sheet });
			}
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// Delete sheet record
const recordDelete = async (req, res) => {
	const { user_id, sheet_id, _id } = req.body;

	try {
		checkUserSession(req.session, user_id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	await Sheet.deleteRecord(user_id, sheet_id, _id)
		.then((sheet) => {
			if (sheet) {
				res.status(200).json({ success: true, sheet: sheet });
			}
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// Add new sheet budget
const budgetAdd = async (req, res) => {
	const { user_id, sheet_id, type, name, current, target, start, end } =
		req.body;

	try {
		checkUserSession(req.session, user_id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	await Sheet.addBudget(
		user_id,
		sheet_id,
		type,
		name,
		current,
		target,
		start,
		end
	)
		.then((sheet) => {
			if (sheet) {
				res.status(200).json({ success: true, sheet: sheet });
			}
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// Update sheet budget
const budgetUpdate = async (req, res) => {
	const { user_id, sheet_id, _id, type, name, current, target, start, end } =
		req.body;

	try {
		checkUserSession(req.session, user_id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	await Sheet.updateBudget(
		user_id,
		sheet_id,
		_id,
		type,
		name,
		current,
		target,
		start,
		end
	)
		.then((sheet) => {
			if (sheet) {
				res.status(200).json({ success: true, sheet: sheet });
			}
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

// Delete sheet budget
const budgetDelete = async (req, res) => {
	const { user_id, sheet_id, _id } = req.body;

	try {
		checkUserSession(req.session, user_id);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}

	await Sheet.deleteBudget(user_id, sheet_id, _id)
		.then((sheet) => {
			if (sheet) {
				res.status(200).json({ success: true, sheet: sheet });
			}
		})
		.catch((err) => {
			const status = err.status || 400;
			res.status(status).json(err.message);
		});
};

module.exports = {
	sheetsDisplayAll,
	sheetDisplay,
	sheetAdd,
	sheetDelete,
	sheetUpdate,
	recordAdd,
	recordUpdate,
	recordDelete,
	budgetAdd,
	budgetUpdate,
	budgetDelete,
};
