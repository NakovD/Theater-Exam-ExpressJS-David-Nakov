const express = require('express');
const router = express.Router();
const {
    authenticate,
    getUserId,
    isAuthorCheck
} = require('../controllers/auth.js');
const failSavingInDB = require('../controllers/dbSaveErrorHandler.js');
const Play = require('../models/play.js');
const { updateUserAndPlay,
    isLiked } = require('../controllers/dbOperations.js');

router.get('/create', authenticate, (req, res) => {
    res.render('create', {                      //TO DO: render create Play template
        isLoggedIn: req.isLoggedIn
    });
});

router.post('/create', authenticate, async (req, res) => {
    const {
        title,
        description,
        imageURL,
    } = req.body;
    let isPublic = req.body.isPublic;
    if (!isPublic) {
        isPublic = false;
    } else {
        isPublic = true;
    }
    const token = req.cookies['aid'];
    const userId = getUserId(token).userId;
    const time = Date.now();
    const newPlay = new Play({ title, description, imageURL, isPublic, createdAt: time, creatorId: userId });
    try {
        const savePlayInDB = await newPlay.save();
        res.redirect('/');
    } catch (error) {
        const errorMessage = failSavingInDB(error);
        res.render('create', {
            isLoggedIn: req.isLoggedIn,
            error: true,
            errorMessage: errorMessage,
        });
    }
});

router.get('/details/:id', authenticate, isAuthorCheck, async (req, res) => {
    const playId = req.params.id;
    const userId = getUserId(req.cookies['aid']).userId;
    try {
        const playInfo = await Play.findById(playId).lean();
        const isLikedBool = isLiked(playInfo.usersLiked, userId);
        res.render('details', {
            play: playInfo,
            isLoggedIn: req.isLoggedIn,
            isAuthor: req.isAuthor,
            isLiked: isLikedBool
        });
    } catch (error) {
        console.log(error.message);
        res.redirect('/');
    }
});

router.get('/edit/:id', authenticate, isAuthorCheck, async (req, res) => {
    const playId = req.params.id;
    try {
        const playInfo = await Play.findById(playId).lean();
        res.render('edit', {
            isLoggedIn: req.isLoggedIn,
            play: playInfo
        });
    } catch (error) {
        res.redirect('/');
    }

});

router.post('/edit/:id', authenticate, isAuthorCheck, async (req, res) => {      //TO DO: add additional middlewares if needed;
    const playId = req.params.id;
    const {
        title,
        description,
        imageURL
    } = req.body;
    let isPublic = req.body.isPublic;
    if (isPublic) {
        isPublic = true;
    } else {
        isPublic = false;
    }

    try {
        const updatePlay = await Play.findByIdAndUpdate({ _id: playId }, { title, description, imageURL, isPublic }, { omitUndefined: true });
        res.redirect(`/details/${playId}`);
    } catch (error) {
        res.redirect('/');
    }
});

router.get('/delete/:id', authenticate, isAuthorCheck, async (req, res) => {
    const playId = req.params.id;
    try {
        const removePlay = await Play.deleteOne({ _id: playId });
        res.redirect('/');
    } catch (error) {
        res.redirect('/');
    }
});

router.get('/like/:id', authenticate, isAuthorCheck, async (req, res) => {
    const playId = req.params.id;
    const userId = getUserId(req.cookies['aid']).userId;
    const updatePlayAndUser = await updateUserAndPlay(playId, userId);
    res.redirect(`/details/${playId}`);
});

module.exports = router;