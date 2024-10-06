const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection } = require(`discord.js`);
const fs = require('fs');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    try {
        for (const file of functions) {
            const functionPath = path.join(__dirname, `./src/functions/${file}`);
            require(functionPath)(client);
        }

        await client.handleEvents(eventFiles, path.join(__dirname, "./src/events"));
        await client.handleCommands(commandFolders, path.join(__dirname, "./src/commands"));
        await client.login(process.env.token);
    } catch (error) {
        console.error("Error occurred during bot startup:", error);
    }
})();