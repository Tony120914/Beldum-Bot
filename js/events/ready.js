// Discord client ready check
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
    client.user.setActivity("with an Everstone", { type: "PLAYING" })
    console.log(`Logged in as ${client.user.tag}!`);
	},
};
