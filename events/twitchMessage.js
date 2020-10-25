const fs = require('fs');

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

    chat.setArgs(chat.message.slice(prefix.length).split(/ +/g).slice(1));
    chat.setSuffix(chat.message.slice(prefix.length).slice(chat.args[0].length + 1));

    const command = chat.message.slice(prefix.length).suffix.split(/ +/g)[0]/toLowerCase();

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