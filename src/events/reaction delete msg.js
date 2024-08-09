module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        if (reaction.emoji.name === '🗑️' && user.id === process.env.botOwnerID) {
            try {
                const message = await reaction.message.fetch();

                if (message.author.id === reaction.client.user.id) {
                    await message.react('✅');
                    setTimeout(async () => { await message.delete() }, 1000);
                }
            } catch (err) { }
        }
    },
};
