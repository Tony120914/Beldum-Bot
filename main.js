
// Acquire token from .env
require('dotenv').config()
const token = process.env.TOKEN;
const token_discordbot = process.env.TOKEN_DISCORDBOT;

// Init discord
const Discord = require('discord.js');
const client = new Discord.Client();
const DBL = require("dblapi.js");
const dbl = new DBL(token_discordbot, client);

// Posting server count for discordbots
dbl.on('posted', () => {
  console.log('Server count posted!');
})
dbl.on('error', e => {
 console.log(e);
})

client.login(token);

// Ready check
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Set bot's playing status
  client.user.setActivity("with an Everstone, //help")
  .then(console.log("Successful set activity"))
  .catch(console.error);

});


// Prefix for commands
const prefix = '//';

// My imports
require('./js/listeners/message_listener.js')(Discord, client, prefix);
