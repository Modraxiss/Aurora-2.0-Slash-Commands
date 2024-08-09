const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-timeout')
        .setDescription('Remove the timeout from a user')
        .addUserOption(option => option.setName('user').setDescription('The user you want to remove the timeout from').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for removing the timeout').setRequired(false)),


    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const reason = interaction.options.getString('reason');

        const warningEmoji = "<a:Warning:1264409367256502453> ";

        if (interaction.member.id === user.id) {
            return await interaction.editReply({ content: warningEmoji + 'You cannot remove your own timeout.' });
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return await interaction.editReply({ content: warningEmoji + "You don't have the permissions to remove a timeout from a user." });
        }

        if (interaction.client.user.id === user.id) {
            return await interaction.editReply({ content: warningEmoji + 'I cannot remove my own timeout.' });
        }

        if (member?.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return await interaction.editReply({ content: warningEmoji + `I cannot remove the timeout from this user! ${user} has moderation permissions.` });
        }

        if (!member) {
            return await interaction.editReply({ content: warningEmoji + 'Member not found.' });
        }

        if (!member.isCommunicationDisabled()) {
            return await interaction.editReply({ content: warningEmoji + `${user} is not currently timed out.` });
        }

        try {
            await member.timeout(null, reason || "No Reason Provided");

            const message = `${user} has had their Timeout removed <:timeoutgreen:1264473172301058068>${reason ? `\nReason: ${reason}` : ''}`;

            await interaction.editReply({ content: "Done!\n" + message });
            await interaction.channel.send(message);
        } catch (err) {
            console.error('Error removing timeout from member:', err);
            await interaction.editReply({ content: warningEmoji + "An error occurred while trying to remove the <:timeoutgreen:1264473172301058068> Timeout from the member." });
        }
    },
};