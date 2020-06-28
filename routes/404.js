const express = require('express');
const { userStatusCheck } = require('../controllers/auth');
const router = express.Router();


router.get('/', userStatusCheck, (req, res) => {
    res.render('404');
});

module.exports = router;