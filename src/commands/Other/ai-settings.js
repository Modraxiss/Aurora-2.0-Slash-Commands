const { SlashCommandBuilder } = require('@discordjs/builders');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    defaultLoading: false,
    data: new SlashCommandBuilder()
        .setName('ai-settings')
        .setDescription('Manage AI setup for the server'),

    async execute(interaction, client) {
        await interaction.deferReply();

        const requiredPermissions = interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild);

        const button = new ButtonBuilder()
            .setLabel(requiredPermissions ? 'Manage AI Setup' : `Permissions Required: 'MANAGE SERVER'`)
            .setCustomId('ai-settings')
            .setStyle(requiredPermissions ? ButtonStyle.Success : ButtonStyle.Danger)
            .setDisabled(requiredPermissions ? false : true);

        if (!requiredPermissions) button.setEmoji("<a:Warning:1264409367256502453>");

        const actionRow = new ActionRowBuilder().addComponents(button);

        await interaction.editReply({ components: [actionRow] });
    },
};
