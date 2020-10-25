const fs = require('fs');
const { client } = require('tmi.js');

module.exports = async (bot, message) => {
    if (message.author.bot) return;
    if (message.channel.type !== 'text') return;

    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;

    let prefix = "!";

    if (!message.content.startsWith(prefix)) return;

    let suffix = message.content.slice(prefix.length);
    let args = suffix.split(/ +/g);
    const command = args[0].toLowerCase();

    suffix = suffix.slice(args[0].length + 1);
    args = args.slice(1);

    message.args = args;
    message.suffix = args;

    const cmdFile = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));

    if (!cmdFile) return;

    if (!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
        return message.channel.send('I need permission `EMBED_LINKS` to respond to commands in this server.')
    }

    let go = true;
    let missingPerms = [];

    if (cmdFile.config.userPerms && message.guild) {
        cmdFile.config.userPerms.forEach(p => {
            if (!message.member.hasPermission(p)) {
                go = false;
                missingPerms.push(p.toUpperCase());
            }
        });
    }

    if (!go) {
        message.channel.send(`You are missing the following permissions needed to perform this action:\n
        \`${missingPerms.join(", ")}\``);
        return;
    }

    if (cmdFile.config.enabled) {
        try {
            cmdFile.discordRun(bot, message);
        }
        catch(err) {
            message.channel.send("There was an error executing this command.");
            console.error(`Command ${command} failed to run!\n\n${err.stack ? err.stack : err}`);
        }
    }
    
    else {
        message.channel.send("This command is currently disabled.");
    }
}