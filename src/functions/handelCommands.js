const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');

const clientId = process.env.botID;

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);

                if (command.disable && command.disable === true) {
                    console.log(`\x1b[31m%s\x1b[0m`, `Command /${command.data.name} Stopped to Load`);
                    continue;
                } else if (!command.data) {
                    continue;
                }

                console.log(`\x1b[36m%s\x1b[0m`, `Command /${command.data.name} Loaded ✔`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({ version: '10' }).setToken(process.env.token);

        (async () => {
            try {
                console.log(`\x1b[93m%s\x1b[0m`, 'Started refreshing application (/) commands...');

                await rest.put(
                    Routes.applicationCommands(clientId),
                    { body: client.commandArray }
                );

                console.log(`\x1b[34m%s\x1b[0m`, 'Successfully reloaded application (/) commands\n\n');
            } catch (err) {
                console.log(`\x1b[31m%s\x1b[0m`, '\nFailed to reload application (/) commands\n');
                console.error(err);
            }
        })();
    };
};