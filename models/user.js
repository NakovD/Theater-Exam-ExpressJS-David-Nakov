const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'Username must be at least 3 characters long!'],
        match: /([A-Za-z\d]+)/g
    },
    password: {
        type: String,
        required: true,
    },
    likedPlays: [{
        type: 'ObjectId',
        ref: 'Play'
    }]
});

module.exports = mongoose.model('User', User);