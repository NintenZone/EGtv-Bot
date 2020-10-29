const reqEvent = event => require(`../events/${event}.js`);

module.exports = bot => {
    //Discord Events
    bot.discordClient.on('message', (message) => reqEvent('discordMessage')(bot, message));

    bot.discordClient.on('voiceStateUpdate', (oldState, newState) => reqEvent('micCommandChannelListener')(bot, oldState, newState));

    //Discord Client Output
    bot.discordClient.on('ready', () => reqEvent('console')(bot.discordClient, 'ready'));
    bot.discordClient.on('debug', bug => reqEvent('console')(bug, 'debug'));
    bot.discordClient.on('warn', warn => reqEvent('console')(warn, 'warn'));
    bot.discordClient.on('error', err => reqEvent('console')(err, 'error'));

    //Twitch Events
    bot.twitchClient.on('chat', (channel, user, message, self) => reqEvent('twitchMessage')(bot, channel, user, message, self));
    bot.twitchClient.on('connected', () => reqEvent('console')(bot.twitchClient, 'twitchConnected'));
    
    //Process Handling
    process.on('unhandledPromiseRejection', console.error);
    process.on('unhandledRejection', console.error);
}