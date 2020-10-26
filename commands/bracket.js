const fs = require('fs');

let setBracket = function(newBracket) {
    fs.writeFileSync("./data/bracket.txt", newBracket);
}

exports.discordRun = async(bot, message) => {
    if (message.args[0]) {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            if (message.args[0].toLowerCase() === "clear") {
                setBracket("");
                message.channel.send("Cleared bracket command.");
                return;
            }
            setBracket(message.args[0]);
        }
    }

    fs.readFile("./data/bracket.txt", 'utf-8', function(err, data)  {
        let bracket;
        if (err) {
            console.error();
            bracket = "";
        }
        else {
            bracket = data;
        }

        if (bracket && bracket.length > 1) {
            message.channel.send(bracket);
        }
        else {
            message.channel.send("There is currently no active bracket.");
        }
    });   
}

exports.twitchRun = (bot, chat) => {
    if (chat.args[0]) {
        if (bot.twitchPermLevel(chat.user) >= 3) {
            if (chat.args[0].toLowerCase() === "clear") {
                setBrakcet("");
                return;
            }
            setBracket(chat.args[0]);
        }
    }

    fs.readFile("./data/bracket.txt", 'utf-8', function(err, data)  {
        let bracket;
        if (err) {
            console.error();
            bracket = "";
        }
        else {
            bracket = data;
        }

        if (bracket && bracket.length > 1) {
            bot.twitchClient.say(chat.channel, bracket);
        }
    });  
}

exports.config = {
    enabled: true,
    aliases: [],
    userPerms: [],
    twitchPermLevel: 1
}