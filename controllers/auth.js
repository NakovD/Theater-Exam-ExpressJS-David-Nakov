const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const privateKey = require('../config/config.js').development.privateKey;
const saltRounds = 10;
const Play = require('../models/play.js');

const generateToken = data => {
    const token = jwt.sign(data, privateKey);
    return token;
}

const passwordCheck = data => {
    const password = data.password;
    const repeatPassword = data.repeatPassword;
    if (password.length < 3) {
        return {
            error: true,
            message: 'Password must be at least 3 characters long!'
        }
    }

    const regex = /[A-Za-z\d]+/g;
    const passwordCheck = regex.test(password);
    if (!passwordCheck) {
        return {
            error: true,
            message: 'Password must contain only digits and/or English letters!'
        }
    }
    if (password !== repeatPassword) {
        return {
            error: true,
            message: 'Passwords do not match!'
        }
    }

    return {
        error: false
    }
}

const register = async (req, res) => {
    const { username,
        password,
        repeatPassword } = req.body;

    const passwordCheckBool = passwordCheck({
        password,
        repeatPassword
    });

    if (passwordCheckBool.error) {
        return passwordCheckBool
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            username,
            password: hashedPassword
        });
        const saveUserInDB = await newUser.save();
        const token = generateToken({
            userId: newUser._id,
            username: newUser.username
        });
        res.cookie('aid', token);
        res.redirect('/');
        return {
            error: false
        }
    } catch (error) {
        console.log(error.message);
        return {
            error: true,
            message: 'Username is invalid!'
        }
    }
}

const logIn = async (req, res) => {
    const {
        username,
        password
    } = req.body;
    const usernameCheck = await User.findOne({ username: username }).lean();
    if (!usernameCheck) {
        return {
            error: true,
            message: 'Invalid password or username!'
        }
    }
    const passwordCheck = await bcrypt.compare(password, usernameCheck.password);
    if (!passwordCheck) {
        return {
            error: true,
            message: 'Invalid password or username!'
        }
    }
    try {
        const token = generateToken({
            userId: usernameCheck._id,
            username: username
        });
        res.cookie('aid', token);
        res.redirect('/');
        return {
            error: false
        }
    } catch (error) {
        return {
            error: true,
            message: 'Something went wrong! Please, try again later!'
        }
    }
}

const authenticate = (req, res, next) => {
    const token = req.cookies['aid'];
    if (!token) {
        req.isLoggedIn = false;
        res.redirect('/');
        return;
    }
    try {
        const verification = jwt.verify(token, privateKey);
        req.isLoggedIn = true;
        next();
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
}

const userStatusCheck = (req, res, next) => {
    const token = req.cookies['aid'];
    if (!token) {
        req.isLoggedIn = false;
    }
    try {
        const verification = jwt.verify(token, privateKey);
        req.isLoggedIn = true;
        if (req.url.includes('logIn') || req.url.includes('register')) {
            console.log('here');
            res.redirect('/');
            return;
        }
    } catch (error) {
        req.isLoggedIn = false;
    }
    next();
}

const getUserId = (token) => {
    const decodedToken = jwt.verify(token, privateKey);

    return decodedToken;
}

const isAuthorCheck = async (req, res, next) => {
    const token = req.cookies['aid'];
    if (!token) {
        req.isAuthor = false;
        next();
        return;
    }
    const playId = req.params.id;
    try {
        const play = await Play.findById(playId);
        const decodedToken = jwt.verify(token, privateKey);
        if (play.creatorId === decodedToken.userId) {
            req.isAuthor = true;
            if (req.url.includes('like')) {
                res.redirect('/');
                return;
            }
        } else {
            req.isAuthor = false;
            if (req.url.includes('edit') || req.url.includes('delete')) {  
                res.redirect('/');
                return;
            }

        }
    } catch (error) {
        console.error(error);
        req.isAuthor = false;
    }
    next();
}


module.exports = {
    register,
    logIn,
    authenticate,
    userStatusCheck,
    getUserId,
    isAuthorCheck
}
