const User = require('../models/user.js');
const Play = require('../models/play.js');

const updateUserAndPlay = async (playId, userId) => {
    const courseUpdate = await Play.findByIdAndUpdate(playId, {
        $addToSet: { usersLiked: [userId] }
    });
    const userUpdate = await User.findByIdAndUpdate(userId, {
        $addToSet: { likedPlays: [playId] }
    });
    return;
}
const isLiked = (arrayWithLikedUsers, userId) => {
    const arrayWithIds = arrayWithLikedUsers;
    const normalArray = arrayWithIds.map(el => el.toHexString());
    if (normalArray.includes(userId)) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    updateUserAndPlay,
    isLiked,
};
