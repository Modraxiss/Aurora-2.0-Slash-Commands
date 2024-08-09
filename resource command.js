const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    disable: true,
    defaultLoading: false,
    ephemeralReply: true,
    data: new SlashCommandBuilder()
        .setName('')
        .setDescription(''),

    async execute(interaction, client) {

    },
};
