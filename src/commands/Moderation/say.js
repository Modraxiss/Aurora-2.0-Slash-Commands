const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('send a message')
        .addStringOption(option => option.setName('message').setDescription('no description provided').setRequired(true))
        .addStringOption(option => option.setName('message-id').setDescription('no description provided')),

    async execute(interaction, client) {
        const message = interaction.options.getString('message');
        const replyId = interaction.options.getString('message-id');

        const warningEmoji = "<a:Warning:1264409367256502453> ";

        // if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.editReply({ content: warningEmoji + "You don't have the required permissions" });
        if (interaction.member.id !== "1026551616637255690") return await interaction.editReply({ content: warningEmoji + "This command is disabled for *@everyone*" });

        try {
            let repliedMessage;
            if (replyId) {
                repliedMessage = await interaction.channel.messages.fetch(replyId).catch(async (err) => {
                    return null;
                });
                if (!repliedMessage) {
                    return await interaction.editReply({ content: warningEmoji + 'Invalid message ID' });
                }
            };

            const typingDuration = Math.min(5000, 10 * message.length);
            await interaction.channel.sendTyping();

            setTimeout(async () => {
                try {
                    if (repliedMessage) {
                        await repliedMessage.reply(message);
                    } else {
                        await interaction.channel.send(message);
                    }
                    await interaction.editReply({ content: `Message has been sent!` });
                } catch (error) {
                    console.error('Error sending message:', error);
                    await interaction.editReply({ content: warningEmoji + 'An error occurred while sending the message.' });
                }
            }, typingDuration);
        } catch (err) {
            return await interaction.editReply({ content: warningEmoji + 'An error occurred while sending messages.' });
        }
    },
};