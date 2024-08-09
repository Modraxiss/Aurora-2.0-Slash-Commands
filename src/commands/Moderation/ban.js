const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option => option.setName('user').setDescription('The user you want to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for banning the member')),

    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        const userID = user.id;
        const banUser = client.users.cache.get(userID);
        const reason = interaction.options.getString('reason') || "No Reason Provided";

        const warningEmoji = "<a:Warning:1264409367256502453> ";

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.editReply({ content: warningEmoji + "You don't have the permissions to ban a user" });
        if (interaction.member.id === userID) return await interaction.editReply({ content: warningEmoji + "You cannot ban yourself" });


        try {
            await interaction.guild.members.ban(banUser.id, { reason });

            await interaction.editReply({ content: `${user} has been banned\nReason: ${reason}` });

            await banUser.send({ content: `You have been banned from **${interaction.guild.name}**\nReason: ${reason}` }).catch((err) => { });
        } catch (err) {
            return interaction.editReply({ content: warningEmoji + "I cannot ban this member!" });
        }

    },
};