const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete a specified number of messages from the channel.')
        .addIntegerOption(option => option.setName('amount').setDescription('The number of messages to delete.').setRequired(true)),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        const loadingEmoji = "<a:Loading:1264409341427974146>";
        const warningEmoji = "<a:Warning:1264409367256502453> ";

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.editReply({ content: warningEmoji + "You don't have the permissions to *purge* messages" });

        if (amount <= 0 || amount > 100) {
            return await interaction.editReply({ content: warningEmoji + 'You can only delete between 1 and 100 messages at a time.' });
        }

        try {
            const fetched = await interaction.channel.messages.fetch({ limit: amount });
            await interaction.editReply({ content: `Loading ${fetched.size} message(s). ` + loadingEmoji });

            if (fetched.size === 0) {
                return await interaction.editReply({ content: warningEmoji + 'No messages found to delete.' });
            }
            await interaction.editReply({ content: `${fetched.size} message(s) successfully loaded` });

            await interaction.channel.bulkDelete(fetched, true);
            await interaction.editReply({ content: `Successfully deleted ${fetched.size} message(s).` });
        } catch (err) {
            console.error('Error while purging messages:', err);
            await interaction.editReply({ content: warningEmoji + 'An error occurred while purging messages. Ensure that the messages are not older than 14 days.' });
        }

    },
};