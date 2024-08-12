const { Events, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (interaction.isButton()) {
                if (interaction.customId === 'ai-settings') {
                    const originalUserId = interaction.message.interaction.user.id;
                    await interaction.deferReply({ ephemeral: true });

                    if (interaction.user.id !== originalUserId) {
                        return await interaction.editReply({
                            content: `You are not allowed to interact with this button.\nPlease use the command *\`/${interaction.message.interaction.commandName}\`* to interact.`,
                            ephemeral: true
                        });
                    }

                    const requiredPermissions = interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild);

                    const button = new ButtonBuilder()
                        .setLabel('Manage AI Setup')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('ai-settings')
                        .setDisabled(true);

                    const actionRow = new ActionRowBuilder().addComponents(button);

                    await interaction.message.edit({ components: [actionRow] }).catch(err => { });

                    if (requiredPermissions) {
                        const aiSetupUrl = `https://shapes.inc/aurorav2/server/settings/${interaction.guild.id}`;

                        const embed = new EmbedBuilder()
                            .setColor(0x1F8B4C)
                            .setTitle('AI Setup Management')
                            .setURL(aiSetupUrl)
                            .setDescription('Manage and customize the AI settings for your server using our intuitive web interface.')
                            .addFields(
                                { name: 'Server', value: interaction.guild.name, inline: true },
                                { name: 'Admin', value: `<@${interaction.user.id}>`, inline: true },
                                { name: 'Access', value: 'Click the button below to start managing your AI settings.', inline: false },
                                { name: 'Features', value: 'Customize behavior, manage permissions, view analytics, and more!' }
                            )
                            .setFooter({ text: 'Aurora AI Management - Powered by Shapes.inc' });

                        const button1 = new ButtonBuilder()
                            .setLabel('AI Management')
                            .setStyle(ButtonStyle.Link)
                            .setURL(aiSetupUrl);

                        const button2 = new ButtonBuilder()
                            .setLabel('How to Setup?')
                            .setStyle(ButtonStyle.Link)
                            .setURL('https://wiki.shapes.inc/shape-essentials/server-settings');

                        const button3 = new ButtonBuilder()
                            .setLabel('Analytics')
                            .setStyle(ButtonStyle.Link)
                            .setURL('https://shapes.inc/aurorav2/analytics');

                        const AI_Management = new ActionRowBuilder().addComponents(button1, button2, button3);

                        await interaction.editReply({ embeds: [embed], components: [AI_Management], ephemeral: true });
                    } else {
                        const embed = new EmbedBuilder()
                            .setColor(0x8C1F1F)
                            .setTitle('Access Denied')
                            .setDescription('<a:Warning:1264409367256502453> You don\'t have the permissions to manage the AI setup.')
                            .addFields(
                                { name: 'Required Permission', value: 'Manage Guild', inline: true },
                                { name: 'Admin', value: `<@${originalUserId}>`, inline: true }
                            )
                            .setFooter({ text: 'Aurora AI Management - Powered by Shapes.inc' });

                        await interaction.editReply({ embeds: [embed], ephemeral: true });
                    }
                }
            }

        } catch (error) {
            console.error('Error handling interaction:', error);

            if (!interaction.deferred || !interaction.replied) await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({ content: '<a:Warning:1264409367256502453> An error occurred while processing your request. Please try again later!' });
        }
    }
};
