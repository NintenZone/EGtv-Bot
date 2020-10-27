const fs = require('fs');

const twitchPerms = require('../utils/twitchPerms.js');

class Chat {
    constructor(channel, user, message, self) {
        this.channel = channel;
        this.user = user;
        this.message = message;
        this.self = self;
        this.args = [];
        this.suffix = "";
    }

    message() {
        return this.message;
    }

    user() {
        return this.user;
    }

    channel() {
        return this.user;
    }

    self() {
        return this.self;
    }

    suffix() {
        return this.suffix;
    }

    args() {
        return this.args;
    }

    setSuffix(suffix) {
        this.suffix = suffix;
    }

    setArgs(args) {
        this.args = args;
    }
}

module.exports = async (bot, channel, user, message, self) => {

    let chat = new Chat(channel, user, message, self);

    if (self) return;

    let prefix = "!";

    if (!chat.message.startsWith(prefix)) return;

    let suffix = chat.message.slice(prefix.length);
    let args = suffix.split(/ +/g);
    const command = args[0].toLowerCase();

    suffix = suffix.slice(args[0].length + 1);
    args = args.slice(1);

    chat.setArgs(args);
    chat.setSuffix(suffix);

    const cmdFile = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));

    if (!cmdFile) return;

    let go = true;

    let getPermissionsLevel = function(userType) {
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

    if (cmdFile.config.twitchPermLevel) {
        if (cmdFile.config.twitchPermLevel < getPermissionsLevel(chat.user.userType)) {
            go = false;
        }
    }

    if (!go) return;

    if (cmdFile.config.enabled) {
        try {
            cmdFile.twitchRun(bot, chat);
        }
        catch(err) {
            console.error(`Command ${command} failed to run\n\n${err.stack ? err.stack : err}`);
        }
    }
}