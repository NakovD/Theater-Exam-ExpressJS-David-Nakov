const express = require('express');
const router = express.Router();
const { userStatusCheck, authenticate } = require('../controllers/auth.js');
const Play = require('../models/play.js');

router.get('/', userStatusCheck, async (req, res) => {
    const plays = await Play.find().lean();
    const onlyPublic = plays.filter(el => el.isPublic);
    if (req.isLoggedIn) {
        const sortedByDate = onlyPublic.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.render('home', {
            isLoggedIn: req.isLoggedIn,
            plays: sortedByDate
        });
        return;
    } else {
        let sorted = onlyPublic.sort((a, b) => b.usersLiked.length - a.usersLiked.length);
        if (sorted.length > 3) {
            sorted = sorted.slice(0, 3);
        }
        res.render('home', {
            isLoggedIn: req.isLoggedIn,
            plays: sorted
        });
        return;
    }
});

router.get('/sortByLikes', authenticate, async (req, res) => {
    const allPlays = await Play.find().lean();
    const onlyPublic = allPlays.filter(el => el.isPublic);
    const sorted = onlyPublic.sort((a, b) => b.usersLiked.length > a.usersLiked.length);
    res.render('home', {
        isLoggedIn: req.isLoggedIn,
        plays: sorted
    });
});

router.get('/sortByDate/', authenticate, async (req, res) => {
    const plays = await Play.find().lean();
    const onlyPublic = plays.filter(el => el.isPublic);
    const sortedByDate = onlyPublic.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.render('home', {
        isLoggedIn: req.isLoggedIn,
        plays: sortedByDate
    });
});


module.exports = router;