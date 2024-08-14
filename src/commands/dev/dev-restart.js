const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
    defaultLoading: false,
    data: new SlashCommandBuilder()
        .setName('dev-restart')
        .setDescription('Restarts the bot'),

    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const ownerId = process.env.botOwnerID;

        if (!ownerId) return interaction.editReply({ content: "The bot owner ID is not specified, unable to verify authorization." });

        if (interaction.user.id !== ownerId) return interaction.editReply({ content: "You don't have permission to execute this command." });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('restart_yes')
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('restart_no')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger),
            );

        await interaction.editReply({ content: 'Are you sure you want to restart the bot?', components: [row], });

        const filter = (i) => i.customId === 'restart_yes' || i.customId === 'restart_no';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'restart_no') {
                await interaction.editReply({ content: 'Bot restart has been canceled.', components: [] });
                return;
            }

            if (i.customId === 'restart_yes') {
                await interaction.editReply({ content: 'Restarting the bot... Please hold on for a moment.', components: [] });

                client.destroy();

                exec('node start.js', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        interaction.editReply({ content: 'An error occurred during the bot restart process. Please check the console for more details.', components: [] });
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);

                    interaction.editReply({ content: 'The bot has been successfully restarted and is now back online.', components: [] });
                });
            }
        });

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                const timeoutRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('end_restart_yes')
                            .setLabel('Yes')
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('end_restart_no')
                            .setLabel('No')
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true),
                    );
                interaction.editReply({ content: 'No response received. Restart action timed out.', components: [timeoutRow] });
            }
        });
    },
};
