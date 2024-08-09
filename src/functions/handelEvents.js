module.exports = (client) => {
    client.handleEvents = async (eventFiles, path) => {
        console.clear(true);
        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            console.log(`\x1b[92m${event.name} >\x1b[0m >> \x1b[34m> (\x1b[0m ${file} \x1b[34m) Loaded!\x1b[0m`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    };
};
