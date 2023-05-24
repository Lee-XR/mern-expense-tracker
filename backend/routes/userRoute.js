const express = require('express');
const router = express.Router();

// user controller functions
const { userLogin, userRegister, userRefresh, userUpdate, userDelete, userLogout } = require('../controllers/userController');

// user login account
router.post('/login', userLogin);

// user signup account
router.post('/register', userRegister);

// user refresh session
router.get('/refresh', userRefresh)

// update user account
router.post('/update', userUpdate);

// delete user account
router.post('/delete', userDelete);

// user logout account
router.post('/logout', userLogout)

module.exports = router;