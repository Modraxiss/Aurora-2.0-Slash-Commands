const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user for a specified duration')
        .addUserOption(option => option.setName('user').setDescription('The user you want to timeout').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('Duration of the timeout in minutes').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for timing out the member').setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const reason = interaction.options.getString('reason');
        const duration = interaction.options.getInteger('duration');

        const warningEmoji = "<a:Warning:1264409367256502453> ";

        if (interaction.member.id === user.id) {
            return await interaction.editReply({ content: warningEmoji + 'You cannot timeout yourself.' });
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return await interaction.editReply({ content: warningEmoji + "You don't have the permissions to timeout a user." });
        }

        if (interaction.client.user.id === user.id) {
            return await interaction.editReply({ content: warningEmoji + 'I cannot timeout myself.' });
        }

        if (member?.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return await interaction.editReply({ content: warningEmoji + `I cannot timeout this user! ${user} has moderation permissions.` });
        }

        if (!member) {
            return await interaction.editReply({ content: warningEmoji + 'Member not found.' });
        }

        const durationMs = duration * 60 * 1000; // Convert minutes to milliseconds

        try {
            await member.timeout(durationMs, reason || "No Reason Provided");
            const message = `${user} has been Timed out for ${duration} minutes <:timeoutred:1264473190663716925>${reason ? `\nReason: ${reason}` : ''}`;

            await interaction.editReply({ content: "Done!\n" + message });
            await interaction.channel.send(message);
        } catch (err) {
            console.error('Error timing out member:', err);
            await interaction.editReply({ content: warningEmoji + "An error occurred while trying to <:timeoutred:1264473190663716925> Timeout the member." });
        }
    },
};