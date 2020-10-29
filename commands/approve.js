const fs = require('fs');

exports.discordRun = (bot, message) => {
    if (message.args[0]) {
        let data = JSON.parse(fs.readFileSync("./data/checkin.json"));
        if (isNaN(parseInt(message.args[0]))) return message.channel.sen("You must enter a team ID as a number.")
        if (data.teams[message.args[0]]) {
            data.teams[message.args[0]].approved = true;
            bot.discordClient.channels.fetch(data.teams[message.args[0]].channelID).then(channel => {
                channel.messages.fetch(data.teams[message.args[0]].messageID).then(msg => {
                    if (channel.permissionsFor(channel.guild.member(bot.discordClient.user)).has("ADD_REACTIONS"))
                    msg.react(`${data.teams[message.args[0]].channelID === "310424600226037760" ? "<:SMC_Check:751870454570156183>" : "✅"}`);
                })
            })
            message.channel.send("Team **" + data.teams[message.args[0]].name + "'s** roster was approved.");
            fs.writeFileSync("./data/checkin.json", JSON.stringify(data, null, 2));
        }
    }
}

exports.twitchRun = (bot, chat) => {
    return;
}

exports.config = {
    enabled: true,
    aliases: [],
    userPerms: [],
    twitchPermLevel: 1
}