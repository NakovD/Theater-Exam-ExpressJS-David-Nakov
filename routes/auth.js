const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const {
    register,
    logIn,
    userStatusCheck
} = require('../controllers/auth.js');

router.get('/register', userStatusCheck, (req, res) => {
    res.render('registerPage');
});

router.post('/register', userStatusCheck, async (req, res) => {
    const registerUser = await register(req, res);
    if (registerUser.error) {
        res.render('registerPage', {
            error: true,
            errorMessage: registerUser.message
        });
    }
});

router.get('/logIn', userStatusCheck, (req, res) => {
    res.render('loginPage');
});

router.post('/logIn', userStatusCheck, async (req, res) => {
    const logInUser = await logIn(req, res);
    if (logInUser.error) {
        res.render('loginPage', {
            error: true,
            errorMessage: logInUser.message
        });
    }
});

router.get('/logOut', (req, res) => {
    res.clearCookie('aid');
    res.redirect('/');
});

module.exports = router;