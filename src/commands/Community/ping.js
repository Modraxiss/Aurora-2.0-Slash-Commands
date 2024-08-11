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

        await interaction.editReply({ content: "<a:Refreshing:1272062448915976322>" });

        const roundTripLatency = Date.now() - startTime;
        const apiLatency = Math.round(client.ws.ping);

        const statusEmoji = roundTripLatency < 800 ? '<a:Wifi_Green:1271842106297810996>' : roundTripLatency < 1600 ? '<a:Wifi_Yellow:1271845367142551653>' : '<a:Wifi_Red:1271840634650497054>';

        const embed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setTitle('Pong! Latency Information')
            .setDescription('Here are the details:')
            .addFields(
                { name: 'Round-trip Latency', value: `${roundTripLatency}ms ${statusEmoji}`, inline: true },
                { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
                { name: 'Response Delay', value: `${deferTime}ms`, inline: true }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
    },
};
