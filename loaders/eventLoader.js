const reqEvent = event => require('../events/${event}.js');

module.exports = bot => {
    //Discord Events
    bot.discordClient.on('message', reqEvent('message'));

    bot.discordClient.on('voiceStateUpdate', reqEvent('micCommandChannelListener'))

    //Discord Client Output
    bot.discordClient.on('ready', () => reqEvent('console')(bot.discordClient, 'ready'));
    bot.discordClient.on('debug', bug => reqEvent('console')(bug, 'debug'));
    bot.discordClient.on('warn', warn => reqEvent('console')(warn, 'warn'));
    bot.discordClient.on('error', err => reqEvent('console')(err, 'error'));
}