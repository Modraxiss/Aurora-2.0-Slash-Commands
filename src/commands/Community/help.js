const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays all of the commands for this bot'),
    async execute(interaction) {

        const commands = [
            {
                command_name: "help",
                command_description: "Displays all of the commands for this bot"
            },
            {
                command_name: "ping",
                command_description: "Check the bot's latency"
            },
            {
                command_name: "timeout",
                command_description: "Timeout a user for a specified duration"
            },
            {
                command_name: "remove-timeout",
                command_description: "Remove the timeout from a user"
            },
            {
                command_name: "ban",
                command_description: "Ban a user from the server"
            },
            {
                command_name: "unban",
                command_description: "Unban a user from the server"
            },
            {
                command_name: "purge",
                command_description: "Delete a specified number of messages from the channel"
            }
        ];

        let content = "### Here are the available commands:\n";
        commands.forEach(command => {
            content += `> **/${command.command_name}**:\n> Description: *${command.command_description}*\n\n`;
        });

        await interaction.editReply({ content: content });

    },
};