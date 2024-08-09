// guild commands deleter
const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { Client } = require('discord.js'); // Import Client to fetch guilds

const clientId = process.env.botID;

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                if (!command.data) continue;
                console.log(`\x1b[36m%s\x1b[0m`, `Command /${command.data.name} Loaded ✔`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({ version: '9' }).setToken(process.env.token);

        (async () => {
            try {
                console.log(`\x1b[93m%s\x1b[0m`, 'Started deleting application (/) commands...');

                // Fetch all global commands and delete them
                const globalCommands = await rest.get(Routes.applicationCommands(clientId));
                for (const command of globalCommands) {
                    await rest.delete(`${Routes.applicationCommands(clientId)}/${command.id}`);
                    console.log(`\x1b[31m%s\x1b[0m`, `Global Command /${command.name} Deleted ✖`);
                }

                // Fetch all joined guilds
                const guilds = await client.guilds.fetch(); // Requires GUILD intent enabled

                // Delete guild commands for each guild
                for (const [guildId, guild] of guilds) {
                    const guildCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
                    for (const command of guildCommands) {
                        await rest.delete(`${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`);
                        console.log(`\x1b[31m%s\x1b[0m`, `Guild Command /${command.name} Deleted ✖ in Guild ${guild.name} (${guildId})`);
                    }
                }

                console.log(`\x1b[34m%s\x1b[0m`, 'Successfully deleted all application (/) commands\n\n');
            } catch (error) {
                console.log(`\x1b[31m%s\x1b[0m`, '\nFailed to delete application (/) commands\n');
                console.error(error);
            }
        })();
    };
};
