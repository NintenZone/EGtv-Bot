const fs = require('fs');

//Package config.
class Bot {
    constructor(discordClient, twitchClient, config) {
        this.discordClient = discordClient;
        this.twitchClient = twitchClient;
        this.config = config;
        this.commands = new Map();
        this.aliases = new Map();
    }
    discordClient() {
        return this.discordClient;
    }
    twitchClient() {
        return this.twitchClient;
    }
    config() {
        return this.config;
    }
    commands() {
        return this.commands;
    }
    aliases() {
        return this.aliases;
    }
    twitchPermissionLevel(user) {
        if (user.userType) {
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
        }
    }
}

const config = require('./config.js');

//Discord Client
const Discord = require('discord.js');

//Twitch Client
const tmi = require('tmi.js');

//Creating New Bot Class

let watched = JSON.parse(fs.readFileSync("./data/channels.json")).watched;
    
const bot = new Bot(new Discord.Client(),
                new tmi.Client({
                    options: {debug: true},
                    connection: {
                        reconnect: true,
                        secure: true
                    },
                    identity: {
                        username: config.twitchUsername,
                        password: `oauth:${config.twitchToken}`
                    },
                    channels: watched
                }),
                config);

bot.discordClient.login(bot.config.discordToken).catch(console.error);

bot.twitchClient.connect().catch(console.error);

//Loaders
require('./loaders/cmdLoader.js')(bot);
require('./loaders/eventLoader.js')(bot);