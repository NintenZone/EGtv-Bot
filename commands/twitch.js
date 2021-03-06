const fs = require("fs");
const { client } = require("tmi.js");

exports.discordRun = (bot, message) => {
    if (message.guild.id !== "467409639504347136") return;
    if (!message.member.hasPermission("ADMINISTRATOR")) return;

    if (!message.args[0] || !message.args[1]) return message.channel.send("You have used this command incorrectly.\nUsage: !twitter <join/leave> <channel_name>");

    let data = JSON.parse(fs.readFileSync("./data/twitchChannels.json"));

    if (!data || !data.toJoin) {
        if (!data) data = {};
        if (!data.toJoin) data.toJoin = [];
    }

    if (message.args[0].toLowerCase() === "join") {
        if (data.toJoin.includes(message.args[1].toLowerCase())) return message.channel.send("That channel is already joined.");
        
        bot.twitchClient.join(message.args[1].toLowerCase()).then(() => {
            data.toJoin.push(message.args[1].toLowerCase());
            message.channel.send(`\`${message.args[1].toLowerCase()}\` was joined successfully.`);
            fs.writeFileSync("./data/twitchChannels.json", JSON.stringify(data, null, 2));
        }).catch((err) => {
            message.channel.send(`\`${message.args[1].toLowerCase()}\` could not be joined. Please see logs for additional information.`);
            console.error(err);
        });
    }
    else if (message.args[0].toLowerCase() === "leave") {
        if (!data.toJoin.includes(message.args[1].toLowerCase())) return message.channel.send("That channel has not been joined, so it cannot be left.");
        
        bot.twitchClient.leave(message.args[1].toLowerCase()).then(() => {
            data.toJoin.splice(data.toJoin.indexOf(message.args[1].toLowerCase()), 1);
            message.channel.send(`\`${message.args[1].toLowerCase()}\` was left successfully.`);
            fs.writeFileSync("./data/twitchChannels.json", JSON.stringify(data, null, 2));
        }).catch((err) => {
            message.channel.send(`\`${message.args[1].toLowerCase()}\` could not be left. Please see logs for additional information.`);
            console.error(err);
        })
    }
    else return message.channel.send("You have used this command incorrectly.\nUsage: !twitter <join/leave> <channel_name>");

}

exports.twitchRun = (bot, chat) => {
    return;
}

exports.config = {
    enabled: true,
    aliases: [],
    userPerms: [],
    twitchPermLevel: 1
};