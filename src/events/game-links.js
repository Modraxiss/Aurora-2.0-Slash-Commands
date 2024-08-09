const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.channelId === process.env.gamelinks_channelID) {
            const isStarblastLink = message.content.includes("https://starblast.io/#");
            const member = await message.guild.members.fetch(message.author.id);
            const hasManageMessagesPermission = member.permissions.has(PermissionsBitField.Flags.ManageMessages);

            if (!isStarblastLink && !hasManageMessagesPermission) {
                try {
                    await message.delete();
                    await message.author.send({
                        content: `Hello <@${message.author.id}>,\nPlease note that only Starblast game links are permitted in <#${message.channelId}>.\nThe message you attempted to post has been removed for this reason, but it has been included below for your reference.\n\n${message.content}`,
                        files: [message.attachments.first()?.url].filter(Boolean),
                    });

                    const alertChannel = await client.channels.fetch('1212687620145020958');
                    if (alertChannel) {
                        await alertChannel.send({
                            content: `<a:Alert:1271337166622167080> A non-Starblast link message by <@${message.author.id}> was deleted in <#${message.channelId}>.\n\n**Message Content:**\n${message.content}`,
                            files: [message.attachments.first()?.url].filter(Boolean),
                        });
                    }
                } catch (err) { }
            }
        }
    }
};