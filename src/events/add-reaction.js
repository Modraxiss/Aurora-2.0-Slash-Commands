const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user, client) {
        // Check if the reaction is a ":wastebasket:" emoji
        console.log('Reaction added by user:', await user.tag);
        console.log('Reaction emoji:', await reaction.emoji.name);
        console.log('Reaction message author:', await reaction.message.author.tag);

        if (await reaction.emoji.name === `U+1F5D1`) {
            try {
                const message = await reaction.message.fetch();
                if (message.author.id === await reaction.client.user.id) {
                    await message.delete();
                }
            } catch (err) {
                console.error(err);
            }
        }
    },
};
