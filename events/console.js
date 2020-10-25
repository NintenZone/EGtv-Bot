module.exports = (stack, type) => {
    //Discord Console
    if (type === 'debug') if (!stack.includes('eartbeat')) console.log(stack);
    if (type === 'warn') console.warn(stack);
    if (type === 'error') console.warn(stack);
    if (type === 'ready') {
        console.log(`Discord client started as ${stack.user.tag}.`);
    }

    //Twitch Console
    if (type === 'twitchConnected') [
        console.log(`Twitch client started as ${stack.getUsername()}.`)
    ]
}