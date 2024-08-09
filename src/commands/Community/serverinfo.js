const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');

module.exports = {
    disable: true,
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about this server'),

    async execute(interaction, client) {
        const loadingEmoji = "<a:Loading:1264409341427974146>";

        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({ content: loadingEmoji });

        try {
            const server = interaction.guild;
            const owner = await server.fetchOwner();
            const memberCount = server.memberCount;

            const onlineMembers = server.members.cache.filter(member => member.presence?.status === 'online').size;

            const boostCount = server.premiumSubscriptionCount || 0;
            const channelsCount = server.channels.cache.size;
            const rolesCount = server.roles.cache.size;

            const serverEmbed = new EmbedBuilder()
                .setTitle(server.name)
                .setThumbnail(server.iconURL({ dynamic: true }))
                .setColor('#2B2D31')
                .addFields(
                    { name: 'Owned by:', value: `<@${owner.id}>`, inline: true },
                    { name: 'Created On:', value: `<t:${Math.floor(server.createdTimestamp / 1000)}:D>`, inline: true },
                    { name: 'Server ID:', value: `${server.id}`, inline: true },
                    { name: `Total Members: ${memberCount}`, value: `Online: ${onlineMembers}`, inline: true },
                    { name: `Total Channels:`, value: `${channelsCount}`, inline: true },
                    { name: 'Others:', value: `Verification Level: **${server.verificationLevel}**\nNSFW Level: **${server.nsfwLevel}**\nBoosts: **${boostCount}**\nRoles: **${rolesCount}**`, inline: false },
                )
                .setFooter({ text: `Serverinfo Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            await interaction.editReply({ content: null, embeds: [serverEmbed] });
        } catch (error) {
            console.error('Error fetching server info:', error);
            await interaction.editReply({ content: `<a:Warning:1264409367256502453> An error occurred while fetching server info. Please try again later.` });
        }
    },
};