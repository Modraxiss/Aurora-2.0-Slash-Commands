const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about this server'),

    async execute(interaction, client) {
        try {
            const server = interaction.guild;
            const owner = await server.fetchOwner();

            const serverdata =
                `**Basic Information:**\n` +
                `* Server Owner: <@${owner.id}>\n` +
                `* Created On: <t:${Math.floor(server.createdTimestamp / 1000)}:f>\n` +
                `* Server ID: *\` ${server.id} \`*\n\n` +

                `**Member Statistics:**\n` +
                `<:StatusOnline:1272086633167978577> ${server.members.cache.filter(member => member.presence?.status === 'online').size} Online  <:gray_circle:1272086619511459882> ${server.memberCount} Members\n\n` +

                `**Channels Information:**\n` +
                `* Categories: ${server.channels.cache.filter(channel => channel.type === 4).size}\n` +
                `* Text Channels: ${server.channels.cache.filter(channel => channel.type === 0).size}\n` +
                `* Voice Channels: ${server.channels.cache.filter(channel => channel.type === 2).size}\n` +
                `* Announcement Channels: ${server.channels.cache.filter(channel => channel.type === 5).size}\n\n` +

                `**Boost Information:**\n` +
                `* Boost Level: ${server.premiumTier || 'None'}\n` +
                `* Boosts: ${server.premiumSubscriptionCount || 0}\n\n` +

                `**Others Details:**\n` +
                `* Verification Level: ${server.verificationLevel}\n` +
                `* NSFW Level: ${server.nsfwLevel}\n` +
                `* Roles: ${server.roles.cache.size}\n` +
                `${server.description ? `* Description: ${server.description}\n` : ''}`;


            const serverInfo = new EmbedBuilder()
                .setTitle(server.name + "                                                 ** **")
                .setThumbnail(server.iconURL({ dynamic: true }))
                .setColor('#2B2D31')
                .setDescription(serverdata)
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });


            await interaction.editReply({ content: null, embeds: [serverInfo] });
        } catch (error) {
            console.error('Error fetching server info:', error);
            await interaction.editReply({ content: `<a:Warning:1264409367256502453> An error occurred while fetching server info. Please try again later.` });
        }
    },
};