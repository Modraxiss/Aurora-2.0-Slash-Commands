const { VoiceChannel } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const style = [`
 █████╗ ██╗   ██╗██████╗  ██████╗ ██████╗  █████╗     ██████╗     ██████╗ 
██╔══██╗██║   ██║██╔══██╗██╔═══██╗██╔══██╗██╔══██╗    ╚════██╗   ██╔═████╗
███████║██║   ██║██████╔╝██║   ██║██████╔╝███████║     █████╔╝   ██║██╔██║
██╔══██║██║   ██║██╔══██╗██║   ██║██╔══██╗██╔══██║    ██╔═══╝    ████╔╝██║
██║  ██║╚██████╔╝██║  ██║╚██████╔╝██║  ██║██║  ██║    ███████╗██╗╚██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝    ╚══════╝╚═╝ ╚═════╝ `];

        console.log(`\x1b[32m%s\x1b[0m`, `${style}`);
        console.log(`\x1b[34m%s\x1b[0m`, `\n➤  ${client.user.displayName} is Ready for (/) Commands!`);

        const ownerID = process.env.botOwnerID || '';

        try {
            const owner = await client.users.fetch(ownerID);

            const message = await owner.send({
                content: `Hello, @**${owner.displayName}**!\nI'm ready!`
            });

            setTimeout(async () => {
                try {
                    await message.delete();
                } catch (deleteErr) {
                    console.error(`Failed to delete message:`, deleteErr);
                }
            }, 1000);
        } catch (err) {
            console.error(`Failed to send message to user ${ownerID}:`, err);
        }

        const voiceChannelId = '1144352853431959612';

        const guild = client.guilds.cache.get(process.env.serverID);
        if (client.guilds.cache.size > 0 && guild) {
            try {
                const fetchedGuild = await client.guilds.fetch(guild.id);

                const voiceChannel = await fetchedGuild.channels.fetch(voiceChannelId);

                if (voiceChannel && voiceChannel instanceof VoiceChannel) {
                    try {
                        joinVoiceChannel({
                            channelId: voiceChannel.id,
                            guildId: guild.id,
                            adapterCreator: guild.voiceAdapterCreator,
                        });
                    } catch (error) {
                        console.error(`Failed to join the voice channel:`, error);
                    }
                } else {
                    console.error(`Voice channel with ID ${voiceChannelId} not found or not a voice channel.`);
                }
            } catch (fetchErr) {
                console.error(`Failed to fetch guild or channel:`, fetchErr);
            }
        } else {
            console.error('No guild found for the bot.');
        }
    },
};
