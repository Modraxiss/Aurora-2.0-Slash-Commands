const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        if (command.defaultLoading === undefined) command.defaultLoading = true;

        if (command.defaultLoading && command.ephemeralReply === undefined) command.ephemeralReply = true;

        try {
            if (command.defaultLoading) {
                await interaction.deferReply({ ephemeral: command.ephemeralReply });
                await interaction.editReply({ content: "<a:Loading:1264409341427974146>" });
            }

            if (!interaction.guild) {
                if (!command.defaultLoading) {
                    await interaction.deferReply({ ephemeral: true });
                    await interaction.editReply({ content: "<a:Loading:1264409341427974146>" });
                }
                return await interaction.editReply({ content: '<a:Warning:1264409367256502453> Slash commands only work on servers!' });
            }


            const alertChannelId = process.env.commandUsageChannelID;
            const alertChannel = await client.channels.fetch(alertChannelId);

            if (interaction.user.id !== process.env.botOwnerID) {
                if (alertChannel) {
                    const options = interaction.options.data.map(option => {
                        return `${option.name}: ${option.value}`;
                    }).join('\n');

                    const embed = new EmbedBuilder()
                        .setColor('#2B2D31')
                        .setTitle('Command Used')
                        .addFields(
                            { name: 'Server', value: interaction.guild.name, inline: true },
                            { name: 'User', value: `<@${interaction.user.id}>`, inline: true },
                            { name: 'Command', value: `\`\`\`${interaction.commandName}\`\`\``, inline: true },
                            { name: 'Options', value: options || 'None', inline: false },
                            { name: 'Channel', value: `<#${interaction.channel.id}>`, inline: true },
                        )
                        .setTimestamp();

                    await alertChannel.send({ embeds: [embed] });
                } else {
                    console.error(`Alert channel with ID ${alertChannelId} not found.`);
                }
            }

            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);

            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({ content: '<a:Warning:1264409367256502453> There was an error while executing this command!' });
            } else {
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply({ content: '<a:Warning:1264409367256502453> There was an error while executing this command!' });
            }
        }
    },
};