const fs = require('fs');

exports.discordRun = (bot, message) => {
    if (!message.args[0]) return message.channel.send("You have used this command incorrectly.\nUsage: !mic <link/register> <twitch_name/twitter_handle> <pronouns>");

    if (message.args[0].toLowerCase() === "link") {
        let data = JSON.parse(fs.readFileSync("./data/mic.json"));
        if (message.member.hasPermission("MANAGE_SERVER")) {
            if (!message.args[1]) return message.channel.send("You must enter the name of the twitch channel the VC should be linked to.");
            if (!message.member.voice && message.member.voice.channel) return message.channel.send("You must be connected to the voice channel you'd like to link.");
            if (!data.channels) {
                data.channels = {};
            }
            data["channels"][message.member.voiceChannel.id] = message.args[1];
            message.channel.send(`Twitch channel \`${message.args[1]}\` mic command was linked to \`${message.member.voice.channel.name}\`.`);
            fs.writeFileSync("./data/mic.json", JSON.stringify(data, null, 2));
        }
        else {
            message.channel.send("You do not have permission to use this command.");
        }
    }
    if (message.args[0].toLowerCase() === "register") {
        if (!message.args[1] || !message.args[2]) return message.channel.send("You have used this command incorrectly.\n Usage: !mic <link> <twitter_handle> <pronouns>");

        if (message.args[1].startsWith("@")) return message.channel.send("Please enter your Twitter handle without the @. It will be added in automatically.");

        let data = JSON.parse(fs.readFileSync("./data/mic.json"));

        if (!data.casters) {
            data.casters = {};
        }
        data.casters[message.author.id] = {twitter: "@" + message.args[1], pronouns: message.args[2]};
        message.channel.send("You were added to the database of caster's successfully.");

        fs.writeFileSync("./data/mic.json", JSON.stringify(data, null, 2));
    }
}

exports.twitchRun = (bot, chat) => {
    let data = JSON.parse(fs.readFileSync("./data/mic.json"));

    if (data[chat.channel].casters) {
        let casters = [];
        data[chat.channel].casters.forEach(caster => {
            casters.push(`${caster.twitter} (${caster.pronouns})`);
        })
        bot.twitchClient.say(chat.channel, casters.join(" & "));
    }
    
}

exports.config = {
    enabled: true,
    aliases: ["testing"],
    userPerms: [],
    twitchPermLevel: 1
};