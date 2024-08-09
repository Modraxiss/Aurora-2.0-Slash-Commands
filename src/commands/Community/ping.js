const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    defaultLoading: false,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s latency'),

    async execute(interaction, client) {
        const startTime = Date.now();
        await interaction.deferReply({ ephemeral: true });

        const deferEndTime = Date.now();
        const deferTime = deferEndTime - startTime;

        await interaction.editReply({ content: "<a:Loading:1226093096933265480>" });

        const editEndTime = Date.now();
        const roundTripLatency = editEndTime - startTime;

        const apiLatency = Math.round(client.ws.ping);

        let statusEmoji;
        if (roundTripLatency < 100) {
            statusEmoji = '🟢';
        } else if (roundTripLatency < 400) {
            statusEmoji = '🟡';
        } else {
            statusEmoji = '🔴';
        }

        const embed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setTitle('Pong!')
            .setDescription('Latency Details:')
            .addFields(
                { name: 'Round-trip Latency', value: `${roundTripLatency}ms ${statusEmoji}`, inline: true },
                { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
                { name: 'Defer Time', value: `${deferTime}ms`, inline: true }
            );

        await interaction.editReply({ content: null, embeds: [embed] });
    },
};
