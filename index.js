//Package config.
class Bot {
    constructor(discordClient, twitchClient, config) {
        this.discordClient = discordClient;
        this.twitchClient = twitchClient;
        this.config = config;
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
}

const config = require('./config.js');

//Discord Client
const Discord = require('discord.js');

//Twitch Client
const tmi = require('tmi.js');
const { default: SQL } = require('sql-template-strings');

//Creating New Bot Class
const bot;

if (config && config.discordToken && config.twitchToken && config.twitchUsername) {
    bot = new Bot(new Discord.Client(),
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
                        channels: []
                    }),
                    config);
}
else {
    console.log("Config.js is invalid. Please ensure all information has been entered correctly.\nThis program requires the following fields to startup:\ntwitchUsername, twitchToken, discordToken");
}



bot.discordClient.login(bot.config.discordToken).catch(console.error);

bot.twitchClient.connect().catch(console.error);

//Database
const sql = require('sqlite');

sql.open('./data/data.sqlite');

//Loaders
require('./loaders/cmdLoader.js')(bot);
require('./loaders/eventLoader.js')(bot);