
// Acquire token from .env
require('dotenv').config()

// Init
const { Client } = require('discord.js');
const client = new Client();

if (process.env.LIVE) {
  // Posting server count for top.gg
  const DBL = require("dblapi.js");
  const dbl = new DBL(process.env.TOKEN_TOPGG, client);

  dbl.on('posted', () => {
    console.log(`Server count posted for shard ${client.shard.id}!`);
  })
  dbl.on('error', e => {
  console.log(e);
  })
}

// Ready check
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Set bot's playing status
  client.user.setActivity("with an Everstone. //info", { type: "PLAYING" })
  .then(() => console.log(`Set activity to => Playing ${client.user.presence.activities}`))
  .catch(console.error);
});

client.login(process.env.TOKEN)

// Listen on API errors
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

// init command handler
const command_handler = require('./js/command_handler.js');
command_handler(client);
