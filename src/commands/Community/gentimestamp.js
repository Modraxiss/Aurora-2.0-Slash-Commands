const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    disable: true,
    data: new SlashCommandBuilder()
        .setName('gentimestamp')
        .setDescription('Generate a Discord timestamp from a specified date and time')

        // date
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('The year (e.g., 2024)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('month')
                .setDescription('The month (1-12)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('day')
                .setDescription('The day of the month (1-31)')
                .setRequired(true))

        // time
        .addIntegerOption(option =>
            option.setName('hour')
                .setDescription('The hour (0-23)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('minute')
                .setDescription('The minute (0-59)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('second')
                .setDescription('The second (0-59)')
                .setRequired(true)),

    async execute(interaction) {

        const year = interaction.options.getInteger('year');
        const month = interaction.options.getInteger('month');
        const day = interaction.options.getInteger('day');
        const hour = interaction.options.getInteger('hour');
        const minute = interaction.options.getInteger('minute');
        const second = interaction.options.getInteger('second');

        if (month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
            return await interaction.editReply({ content: 'Invalid input. Please ensure that month is between 1-12, day is between 1-31, and time values are within the correct ranges (0-23 for hours, 0-59 for minutes and seconds).' });
        }

        const date = new Date(year, month - 1, day, hour, minute, second);
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return await interaction.editReply({ content: 'Invalid date. Please ensure the date is correct and within the valid range for the specified month and year.' });
        }

        const timestamp = Math.floor(date.getTime() / 1000);

        const embed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setTitle('Generated Timestamp')
            .setDescription(`Here is your Timestamp: \`\`\`h\n${timestamp}\`\`\``)
            .addFields(
                { name: 'Short Time', value: `<t:${timestamp}:t> \`\`\`h\n<t:${timestamp}:t>\`\`\``, inline: true },
                { name: 'Long Time', value: `<t:${timestamp}:T> \`\`\`h\n<t:${timestamp}:T>\`\`\``, inline: true },
                { name: 'Short Date', value: `<t:${timestamp}:d> \`\`\`h\n<t:${timestamp}:d>\`\`\``, inline: true },
                { name: 'Long Date', value: `<t:${timestamp}:D> \`\`\`h\n<t:${timestamp}:D>\`\`\``, inline: true },
                { name: 'Short Date/Time', value: `<t:${timestamp}:f> \`\`\`h\n<t:${timestamp}:f>\`\`\``, inline: true },
                { name: 'Long Date/Time', value: `<t:${timestamp}:F> \`\`\`h\n<t:${timestamp}:F>\`\`\``, inline: true },
                { name: 'Relative Time', value: `<t:${timestamp}:R> \`\`\`h\n<t:${timestamp}:R>\`\`\``, inline: true },
            )
            .setFooter({ text: 'Discord Timestamps' });

        await interaction.editReply({ content: null, embeds: [embed] });
    },
};
