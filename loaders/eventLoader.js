const reqEvent = event => require('../events/${event}.js');

module.exports = bot => {
    //Discord Events
    bot.discordClient.on('message', reqEvent('discordMessage'));

    bot.discordClient.on('voiceStateUpdate', reqEvent('micCommandChannelListener'))

    //Discord Client Output
    bot.discordClient.on('ready', () => reqEvent('console')(bot.discordClient, 'ready'));
    bot.discordClient.on('debug', bug => reqEvent('console')(bug, 'debug'));
    bot.discordClient.on('warn', warn => reqEvent('console')(warn, 'warn'));
    bot.discordClient.on('error', err => reqEvent('console')(err, 'error'));

    //Twitch Events
    bot.twitchClient.on('message', (channel, tags, message, self) => reqEvent('twitchMessage'));
    bot.twitchClient.on('connected', () => reqEvent(console)(bot.twitchClient)('twitchConnected'));
    
    //Process Handling
    process.on('unhandledPromiseRejection', console.error);
    process.on('unhandledRejection', console.error);
}