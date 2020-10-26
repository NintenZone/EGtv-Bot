const { Message } = require('discord.js');
const fs = require('fs');

module.exports = (bot, oldState, newState) => {
    let data = JSON.parse(fs.readFileSync("./data/mic.json"));
    
    if (newState.channel) {
        if (data["channels"] && data["channels"][newState.channel.id]) {
            if (data["casters"] && data["casters"][newState.member.user.id]) {
                if (!data[data["channels"][newState.channel.id]]) data[data["channels"][newState.channel.id]] = {};
                data[data["channels"][newState.channel.id]][newState.member.user.id] = data["casters"][newState.member.user.id];
            }
        }
    }
    else {
        if (data["channels"] && data["channels"][oldState.channel.id]) {
            if (data["casters"] && data["casters"][oldState.member.user.id]) {
                delete data[data["channels"][oldState.channel.id]][oldState.member.user.id];
            }
        }
    }

    fs.writeFileSync("./data/mic.json", JSON.stringify(data, null, 2));
}