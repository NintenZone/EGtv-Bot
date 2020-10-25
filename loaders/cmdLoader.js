const fs = require('fs');
const { client } = require('tmi.js');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);

const loadCmd = (path, command, bot) => {
    console.log(`Loading ${command}...`);
    let file = require(`${__dirname}/../commands/${path}`);
    bot.commands.set(command.replace(/.js/g, ''));
    file.config.aliases.forEach(a => {
        client.aliases.set(a, command.replace(/.js/g, ''));
    });
    console.log(`Loaded ${command} successfully.`)
};

exports.loadCmd = loadCmd;

module.exports = async bot => {
    const files = await readdir(`$__dirname/../commands`);

    files.forEach(f => {
        try {
            if (fs.statSync(`$__dirname/../commands/${f}`).isDirectory()) {
                let dFiles = fs.readdirSync(`${__dirname}/../commands/${f}`).filter(fi => fs.statSync(`${__dirname}/../commands/${f}/${fi}`).isFile());
                dFiles.forEach(dF => {
                    loadCmd(`${f}/${dF}`, dF, bot);
                });
            }
            else {
                if (f !== '.DS_Store') loadCmd(f, f, bot);
            }
        }
        catch (err) {
            console.error(`Error loading ${f}:\n${err.stack ? err.stack : err}`);
        }
    });
};