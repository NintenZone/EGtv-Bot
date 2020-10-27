exports.level = (user) => {
    /*if (user.userType) {
        let userType = user.userType;
        if (["broadcaster"].includes(userType)) {
            return 4;
        }
        else if (["mod"].includes(userType)) {
            return 3;
        }
        else if (["subscriber"].includes(userType)) {
            return 2;
        }
        else {
            return 1;
        }
    }
    else {
        return -1;
    }*/

    if (user.mod) {
        return 3;
    }
    else {
        return 1;
    }
}