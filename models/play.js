const mongoose = require('mongoose');


const Play = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: [50, 'Description cannot be more that 50 characters!'],
    },
    imageURL: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        required: true
    },
    creatorId: {
        type: String,
        required: true
    },
    usersLiked: [{
        type: 'ObjectId',
        ref: 'User'
    }]
});

// Play.path('imageURL').validate(function (value) {              //this is validation for URLs, check if you need it;
//     return value.startsWith('http://') || value.startsWith('https://');
// }, 'Image url is invalid!');

module.exports = mongoose.model('Play', Play);