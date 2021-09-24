const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config()

const token = process.env.TOKEN;
const client_id = "465988726775087104"
const guild_id = "342084289002995712"

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
			Routes.applicationGuildCommands(client_id, guild_id),
			{ body: commands },
		);

		console.log(`Successfully registered application commands in DEV`);
	} catch (error) {
		console.error(error);
	}
})();