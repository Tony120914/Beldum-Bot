const log = require('../logger').getLogger();

// Discord client ready check
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
    client.user.setActivity("with /", { type: "PLAYING" })
    log.info(`Logged in as ${client.user.tag}!`);
	},
};
