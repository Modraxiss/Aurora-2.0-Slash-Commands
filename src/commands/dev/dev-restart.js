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

        if (!ownerId) return interaction.editReply({ content: "<a:Warning:1264409367256502453> The bot owner ID is not specified, unable to verify authorization." });

        if (interaction.user.id !== ownerId) return await interaction.editReply({ content: "<:Note:1271777744740417571> You don't have permission to execute this command.\nOnly <:DEV:1271794354398167142> developers can use this command." });

        const buttons = [
            new ButtonBuilder()
                .setCustomId('restart_yes')
                .setLabel('Yes')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('restart_no')
                .setLabel('No')
                .setStyle(ButtonStyle.Danger),
        ];

        const row = new ActionRowBuilder().addComponents(buttons);

        await interaction.editReply({ content: '<a:Alert:1271337166622167080> Are you sure you want to restart the bot?', components: [row] });

        const filter = (i) => i.customId === 'restart_yes' || i.customId === 'restart_no';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                await i.deferReply({ ephemeral: true });
                await i.editReply({ content: '<a:Warning:1264409367256502453> You are not authorized to use this button.', ephemeral: true });
                return;
            }

            if (i.customId === 'restart_no') {
                await interaction.editReply({ content: 'Bot restart has been canceled.', components: [] });
                return;
            }

            if (i.customId === 'restart_yes') {
                await interaction.editReply({ content: 'Restarting the bot...', components: [] });

                exec('node start.js', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        interaction.editReply({ content: '<a:Alert:1271337166622167080> An error occurred during the bot restart process. Please check the console for more details.', components: [] });
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);

                    setTimeout(async () => {
                        await interaction.deleteReply();
                        client.destroy();
                        process.exit();
                    }, 1000);
                });
            }
        });

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                buttons.forEach(button => { button.setDisabled(true) });
                const timeoutRow = new ActionRowBuilder().addComponents(buttons);
                interaction.editReply({ content: '<a:Alert:1271337166622167080> No response received. Restart action timed out.', components: [timeoutRow] });
            }
        });
    },
};
