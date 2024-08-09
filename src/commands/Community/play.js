// const { SlashCommandBuilder } = require("@discordjs/builders");
// const { QueryType } = require('discord-player');

// module.exports = {
//     disable: true,
//     data: new SlashCommandBuilder()
//         .setName('play')
//         .setDescription('Play a song')
//         .addStringOption(option => option.setName('song').setDescription('The song you want to play').setRequired(true)),

//     async execute(interaction, client) {
//         const player = client.player;

//         await interaction.deferReply({ ephemeral: true });
//         await interaction.editReply({ content: "<a:Loading:1226093096933265480>" });

//         const song = interaction.options.getString('song');
//         const res = await player.search(song, {
//             requestedBy: interaction.member,
//             searchEngine: QueryType.AUTO
//         });

//         if (!res?.tracks.length) {
//             return interaction.editReply({ content: `No results found... try again?` });
//         }

//         try {
//             const { track } = await player.play(interaction.member.voice.channel, song, {
//                 nodeOptions: {
//                     metadata: {
//                         channel: interaction.channel
//                     },
//                     volume: client.config.opt.volume,
//                     leaveOnEmpty: client.config.opt.leaveOnEmpty,
//                     leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
//                     leaveOnEnd: client.config.opt.leaveOnEnd,
//                     leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
//                 }
//             });

//             await interaction.editReply({ content: `Loading ${track.title} to the queue... ` });
//         } catch (error) {
//             console.log(`Play error: ${error}`);
//             return interaction.editReply({ content: `I can't join the voice channel... try again? ` });
//         }
//     },
// };
