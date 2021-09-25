const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const log = require('./logger').getLogger();
require('dotenv').config()

const token = process.env.TOKEN;
const client_id = "454764425090433034"

const commands = []

// Read command js files dynamically
const command_files = fs.readdirSync(path.resolve(__dirname, './commands')).filter(file => file.endsWith('.js'));
for (const file of command_files) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Deploy slash commands
const rest = new REST({ version: '9' }).setToken(token);
(async () => {
	try {
		await rest.put(
			Routes.applicationCommands(client_id),
			{ body: commands },
		);

		log.info(`Successfully registered slash commands globally in PROD`);
	} catch (error) {
		log.error(error);
	}
})();