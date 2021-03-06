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
}

const config = require('./config.js');

//Discord Client
const Discord = require('discord.js');

//Twitch Client
const tmi = require('tmi.js');

//Creating New Bot Class

let joined = JSON.parse(fs.readFileSync("./data/twitchChannels.json"));

if (!joined || !joined.toJoin) {
    if (!joined) joined = {};
    if (!joined.toJoin) joined.toJoin = [];

    fs.writeFileSync("./data/twitchChannels.json", JSON.stringify(joined, null, 2));
}


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
                    channels: joined.toJoin
                }),
                config);

bot.discordClient.login(bot.config.discordToken).catch(console.error);

bot.twitchClient.connect().catch(console.error);

//Loaders
require('./loaders/cmdLoader.js')(bot);
require('./loaders/eventLoader.js')(bot);