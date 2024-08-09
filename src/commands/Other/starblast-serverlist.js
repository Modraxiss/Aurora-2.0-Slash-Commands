const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starblast-serverlist')
        .setDescription('Check Starblast server list')
        .addStringOption(option =>
            option.setName('region').setDescription('Starblast Region').setRequired(true).addChoices
                (
                    { name: 'Asia', value: 'Asia' },
                    { name: 'Europe', value: 'Europe' },
                    { name: 'America', value: 'America' }
                )).addStringOption(option => option.setName('mod').setDescription('Starblast Mod').setRequired(true).addChoices
                    (
                        { name: 'Team Mode', value: 'team' },
                        { name: 'Survival Mode', value: 'survival' },
                        { name: 'Pro Deathmatch', value: 'deathmatch' },
                        { name: 'Invasion', value: 'invasion' },
                        { name: 'Modding Space', value: 'modding' },
                        { name: 'Custom Game', value: 'custom' }
                    )
                ),

    async execute(interaction, client) {
        const url = 'https://starblast.dankdmitron.dev';
        const region = interaction.options.getString('region');
        const mod = interaction.options.getString('mod');

        try {
            const response = await fetch(`${url}/api/simstatus.json`);
            const servers = await response.json();

            let gamecount = 0;
            let serverInfoAdded = false;
            const games = [];

            const Translation = {
                modes: {
                    "team": "Team Mode",
                    "survival": "Survival Mode",
                    "deathmatch": "Deathmatch",
                    "modding": "Modding Space",
                    "invasion": "Invasion Mode",
                    "custom": "Custom"
                },
                mods: {
                    "useries": "U-Series",
                    "battleroyale": "Battle Royale",
                    "alienintrusion": "Alien Intrusion",
                    "nauticseries": "Nautic Series",
                    "prototypes": "Prototypes",
                    "src": "Starblast Racing Championship (SRC) 1",
                    "src2": "Starblast Racing Championship (SRC) 2",
                    "rumble": "Rumble",
                    "racing": "Racing",
                    "ctf": "Capture the Flag (CTF)",
                    "dtm": "Destroy the Mothership (DTM)",
                    "mcst": "Multi-Class Ship Tree (MCST)",
                    "sdc": "Starblast Dueling Championship (SDC)",
                    "escalation": "Escalation",
                    "megarumble": "Mega Rumble",
                    "aow_lost_sector": "AOW Lost Sector",
                    "unknown": "Unknown Mod"
                }
            };

            function totalPlayers(region) {
                return servers
                    .filter(server => server.location === region)
                    .reduce((total, server) => total + server.current_players, 0);
            }

            async function getPlayers(gameId, serverAddress) {
                let playerList = 'Failed to load player list';
                let ecpplayers = 0;

                try {
                    const gameApiUrl = `${url}/api/status/${gameId}@${serverAddress}`;
                    const gameApiResponse = await fetch(gameApiUrl);
                    if (gameApiResponse.ok) {
                        const gameApiData = await gameApiResponse.json();
                        if (gameApiData.players) {
                            const players = Object.values(gameApiData.players);
                            playerList = players.map(player => `\` ${player.player_name} \``).join(', ');
                            ecpplayers = players.filter(player => player.custom).length;
                        }
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }

                return { playerList, ecpplayers };
            }

            async function getTeamData(server, game, custom = false) {
                try {
                    const gameApiUrl = `${url}/api/status/${game.id}@${server.address}`;
                    const gameApiResponse = await fetch(gameApiUrl);
                    if (gameApiResponse.ok) {
                        const gameApiData = await gameApiResponse.json();
                        const teams = gameApiData.mode.teams;
                        let teamcount = 0;
                        let currentTime = new Date();
                        currentTime.setSeconds(currentTime.getSeconds() - game.time);

                        const gameInfo = new EmbedBuilder()
                            .setTitle(`Game No.${++gamecount}`)
                            .setColor('#2B2D31')
                            .setDescription(`### Details:\n`)
                            .addFields({
                                name: `Address: ${server.address}`,
                                value: `Mode: **${mod === 'custom' ? `${Translation.modes[mod]} - ${Translation.modes[game.mode]}` : game.mode === "modding" ? `${Translation.modes[game.mode]} - ${Translation.mods[game.mod_id]}` : Translation.modes[game.mode]}**\n` +
                                    `Name: **${game.name}**\n` +
                                    `ID: **${game.id}**\n` +
                                    `Criminality: **${game.criminal_activity}**\n` +
                                    `Total Players: **${Object.keys(gameApiData.players).length}**\n` +
                                    `Total Teams: **${Object.keys(teams).length}**\n` +
                                    `Started at: __<t:${Math.floor(currentTime.getTime() / 1000)}:R>__\n` +
                                    `Link: [Join Game](<https://starblast.io/#${game.id}${custom ? `@${server.address}` : ''}>)\n` +
                                    `\`\`\`vb\nhttps://starblast.io/#${game.id}${custom ? `@${server.address}` : ''}\`\`\``
                            });

                        for (const [teamKey, team] of Object.entries(teams)) {
                            const players = Object.values(gameApiData.players || {});
                            const teamPlayers = players.filter(player => player.hue === team.hue);
                            const ecpPlayers = teamPlayers.filter(player => player.custom).map(player => `\` ${player.player_name} \``);
                            const playerChunks = [];
                            for (let i = 0; i < teamPlayers.length; i += 4) {
                                playerChunks.push(teamPlayers.slice(i, i + 4).map(player => `\` ${player.player_name} \``).join('|'));
                            }
                            const playerList = playerChunks.join('\n');

                            gameInfo.addFields({
                                name: `Team No.${++teamcount}`,
                                value: `**${team.color}**\n` +
                                    `> Total Players: **${teamPlayers.length}**\n` +
                                    `> Gems in Base: **${team.crystals}**\n` +
                                    `> Station Level: **${team.level}**\n` +
                                    `> Total Score: **${team.totalScore}**\n` +
                                    `> ECP Players: **${ecpPlayers.length}**${ecpPlayers.length > 0 ? `\n> ${ecpPlayers.join(', ')}` : ''}`
                            }, {
                                name: 'Player List',
                                value: teamPlayers.length > 0 ? (teamPlayers.length <= 20 ? playerList : `The player list is too long, approximately ${teamPlayers.length} players.`) : "Failed to load player list"
                            });
                        }
                        games.push(gameInfo);
                    }
                } catch (error) {
                    console.error('Error fetching team data:', error);
                }
            }

            async function getInvasionData(server, game, custom = false) {
                try {
                    if (game.open !== false) {
                        let currentTime = new Date();
                        currentTime.setSeconds(currentTime.getSeconds() - game.time);

                        const gameInfo = new EmbedBuilder()
                            .setTitle(`Game No.${++gamecount}`)
                            .setColor('#2B2D31')
                            .setDescription(`### Details:\n`)
                            .addFields({
                                name: `Address: ${server.address}`,
                                value: `Mode: **${mod === 'custom' ? `${Translation.modes[mod]} - Invasion` : 'Invasion'}**\n` +
                                    `Name: **${game.name}**\n` +
                                    `ID: **${game.id}**\n` +
                                    `Total Players: **${game.players}**\n` +
                                    `Started at: __<t:${Math.floor(currentTime.getTime() / 1000)}:R>__\n` +
                                    `Link: [Join Game](<https://starblast.io/#${game.id}${custom ? `@${server.address}` : ''}>)\n` +
                                    `\`\`\`vb\nhttps://starblast.io/#${game.id}${custom ? `@${server.address}` : ''}\`\`\``
                            });
                        games.push(gameInfo);
                    }
                } catch (error) {
                    const errorEmbed = new EmbedBuilder()
                        .setTitle('Starblast ServerList')
                        .setDescription('Error: Failed to fetch data from the API')
                        .setColor('#ff0000');
                    games.push(errorEmbed);
                }
            }

            async function getDefaultData(server, game, custom = false) {
                try {
                    const { playerList, ecpplayers } = await getPlayers(game.id, server.address);
                    let currentTime = new Date();
                    currentTime.setSeconds(currentTime.getSeconds() - game.time);

                    const gameInfo = new EmbedBuilder()
                        .setTitle(`Game No.${++gamecount}`)
                        .setColor('#2B2D31')
                        .setDescription(`### Details:\n`)
                        .addFields({
                            name: `Address: ${server.address}`,
                            value: `Mode: **${mod === 'custom' ? Translation.modes[mod] : game.mode === "modding" ? `${Translation.modes[game.mode]} - ${Translation.mods[game.mod_id]}` : Translation.modes[game.mode]}**\n` +
                                `Name: **${game.name}**\n` +
                                `ID: **${game.id}**\n` +
                                `Criminality: **${game.criminal_activity}**\n` +
                                `Total Players: **${game.players}**\n` +
                                `ECP Players: **${ecpplayers}**\n` +
                                `Started at: __<t:${Math.floor(currentTime.getTime() / 1000)}:R>__\n` +
                                `Link: [Join Game](<https://starblast.io/#${game.id}${custom ? `@${server.address}` : ''}>)\n` +
                                `\`\`\`vb\nhttps://starblast.io/#${game.id}${custom ? `@${server.address}` : ''}\`\`\``
                        }, {
                            name: 'Player List',
                            value: playerList
                        });
                    games.push(gameInfo);
                } catch (error) {
                    console.error('Error fetching default data:', error);
                }
            }

            for (const server of servers) {
                if (server.location === region) {
                    if (!serverInfoAdded) {
                        const serverInfo = new EmbedBuilder()
                            .setTitle('Starblast ServerList')
                            .setColor('#2B2D31')
                            .setDescription(`Region: **${server.location}**\nTotal Players in ${server.location}: **${totalPlayers(server.location)}**`);
                        games.push(serverInfo);
                        serverInfoAdded = true;
                    }

                    for (const game of server.systems) {
                        if (!game.survival) {
                            if (game.mode === mod && mod !== 'custom' && !game.unlisted && !server.modding) {
                                if (game.mode === "team") {
                                    await getTeamData(server, game);
                                } else if (game.mode === "invasion") {
                                    await getInvasionData(server, game);
                                } else {
                                    await getDefaultData(server, game);
                                }
                            } else if (mod === 'custom' && game.unlisted && server.modding) {
                                if (game.mode === "team") {
                                    await getTeamData(server, game, true);
                                } else if (game.mode === "invasion") {
                                    await getInvasionData(server, game, true);
                                } else {
                                    await getDefaultData(server, game, true);
                                }
                            }
                        }
                    }
                }
            }

            if (games.length > 1) {
                await interaction.editReply({ content: null, embeds: games });
            } else {
                const noGamesEmbed = new EmbedBuilder()
                    .setTitle('Starblast ServerList')
                    .setDescription('No Games Found')
                    .setColor('#ff0000');
                await interaction.editReply({ content: null, embeds: [noGamesEmbed] });
            }
        } catch (error) {
            await interaction.editReply({ content: '<a:Warning:1264409367256502453> An error occurred while fetching Starblast data.' });
            console.error('Error fetching Starblast data:\n', error);
        }
    }
};