const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server')
        .addUserOption(option => option.setName('user').setDescription('The user you want to unban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for unbanning the member').setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || "No Reason Provided";

        const warningEmoji = "<a:Warning:1264409367256502453> ";

        // Check permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return await interaction.editReply({ content: warningEmoji + "You don't have the permissions to unban a user." });
        }

        // Check if the user is trying to unban themselves
        if (interaction.member.id === user.id) {
            return await interaction.editReply({ content: warningEmoji + "You cannot unban yourself." });
        }

        try {
            // Fetch the list of banned users
            const bans = await interaction.guild.bans.fetch();

            // Check if the user is banned
            if (!bans.has(user.id)) {
                return await interaction.editReply({ content: warningEmoji + `The user **${user.tag}** is not banned.` });
            }

            // Remove the ban
            await interaction.guild.bans.remove(user.id, reason);

            await interaction.editReply({ content: `${user.tag} has been unbanned.\nReason: ${reason}` });
        } catch (error) {
            console.error('Error unbanning user:', error);
            await interaction.editReply({ content: warningEmoji + "An error occurred while trying to unban the user." });
        }
    },
};