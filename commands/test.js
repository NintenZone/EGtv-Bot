let command = function() {
    return "It worked!";
}

exports.discordRun = (bot, message) => {
    message.channel.send(command());
}

exports.twitchRun = (bot, chat) => {
    bot.twitchClient.say(chat.channel, command());
}

exports.config = {
    enabled: true,
    aliases: ["testing"],
    userPerms: [],
    twitchPermLevel: 1
};