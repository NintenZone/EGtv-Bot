exports.level = (user) => {
    if (user.badges) {
        if (user.badges.broadcaster) {
            return 4;
        }
        else if (user.badges.moderator) {
            return 3;
        }
        else if (user.badges.subscriber) {
            return 2;
        }
        else {
            return 1;
        }
    }
    else {
        return 1;
    }
}