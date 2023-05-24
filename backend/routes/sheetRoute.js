const express = require('express');
const router = express.Router();

// sheet controller functions
const { sheetsDisplayAll, 
        sheetDisplay, 
        sheetAdd, 
        sheetUpdate, 
        sheetDelete, 
        recordAdd, 
        recordUpdate, 
        recordDelete,
        budgetAdd,
        budgetUpdate,
        budgetDelete
    } = require('../controllers/sheetController');

// get all sheets
router.post('/sheets', sheetsDisplayAll);

// add new sheet
router.post('/sheets/add', sheetAdd);

// get single sheet
router.post('/sheets/:id', sheetDisplay);

// update sheet
router.patch('/sheets/:id', sheetUpdate);

// delete sheet
router.post('/sheets/:id/delete', sheetDelete);

// add new sheet record
router.post('/sheets/:id/record', recordAdd);

// update sheet record
router.patch('/sheets/:id/record', recordUpdate);

// delete sheet record
router.post('/sheets/:id/record/delete', recordDelete);

// add new sheet budget
router.post('/sheets/:id/budget', budgetAdd);

// update sheet budget
router.patch('/sheets/:id/budget', budgetUpdate);

// delete sheet budget
router.post('/sheets/:id/budget/delete', budgetDelete);

module.exports = router;