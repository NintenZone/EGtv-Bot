const fs = require('fs');

exports.discordRun = (bot, message) => {
    if (!message.args[0]) return message.channel.send("You have used this command incorrectly.\nUsage:\n;checkin <team name>\<captian name> = <@captian or N/A>\n<Player 1 name> = <@player1 or N/A>\netc...");
    if (message.args[0].toLowerCase() === "open" || message.args[0] === "close") {
        let data = JSON.parse(fs.readFileSync("./data/checkin.json"));
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            if (message.args[0].toLowerCase() === "open") {
                data.enabled = true
                message.channel.send("Checkin is now open!")
            }
            else if (message.args[0].toLowerCase === "close") {
                data.enabled = false;
                message.channel.send("Checkin is now closed!")
            }
            fs.writeFileSync("./data/checkin.json", JSON.stringify(data, null, 2));
        }
    }
    else {
        let data = JSON.parse(fs.readFileSync("./data/checkin.json"));
        if (data.enabled) {
            if (!message.args[0]) return message.channel.send("You have used this command incorrectly.\nUsage:\n;checkin <team name>\<captian name> | <@captian or N/A>\n<Player 1 name> | <@player1 or N/A>\netc...");
            if (!data.teams) data.teams = {};
            let teamID;
            if (!data.teams["1"]) teamID = 1;
            else {
                let max = 0;
                for (const [key, value] of Object.entries(data.teams)) {
                    if (max < parseInt(key)) {
                        max = parseInt(key);
                    }
                }
                teamID = max + 1;
            }
            let teamName = message.suffix.split("\n")[0];
            data.teams[teamID] = {ID: teamID, name: teamName, players: {}}
            teamMembers = {};
            message.suffix.split("\n").slice(1).forEach(line => {
                let args = line.split(" = ");
                let ID;
                let regex = /<@!?\d{18}>/g;
                if (args[1].match(regex)) ID = args[1].replace("<@", "").replace(">", "").replace("!", "").trim();
                else ID = "N/A"
                data.teams[teamID].players[args[0]] = {name: args[0], discordID: ID}
            });

            if (Object.keys(data.teams[teamID].players).length < 4 || Object.keys(data.teams[teamID].players).length > 7) {
                message.channel.send("Your team could not be registered due to there being an incorrect number of players.");
            }
            else {
                if (message.guild.member(bot.discordClient.user).hasPermission("MANAGE_NICKNAMES")) {
                    message.member.setNickname(teamName).catch(err => {
                        return;
                    })
                }

                let players = []

                for (const [key, value] of Object.entries(data.teams[teamID].players)) {
                    players.push(`${key} (<@!${value.discordID}>)`);
                }

                message.channel.send("Team checked in successfully.", {embed: {
                    title: `**${teamName}** - ID: ${teamID}`,
                    description: `**ROSTER**\n${players.join("\n")}`,
                    footer: {
                        text: "EndGameTV Tournament Management",
                        iconURL: bot.discordClient.user.avatarURL()
                    }
                }}).then(message => {
                    data.teams[teamID].messageID = message.id;
                    data.teams[teamID].approved = false;
                    fs.writeFileSync("./data/checkin.json", JSON.stringify(data, null, 2));
                })
            }
        }
        else {
            message.channel.send("Checkin is not currently open.");
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