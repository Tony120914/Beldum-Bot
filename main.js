
// Acquire token from .env
require('dotenv').config()
const token = process.env.TOKEN;
const token_discordbot = process.env.TOKEN_DISCORDBOT;

// Init
const Discord = require('discord.js');
const client = new Discord.Client();
const DBL = require("dblapi.js");
const dbl = new DBL(token_discordbot, client);
var request = require('request');

// Posting server count for discordbots
dbl.on('posted', () => {
  console.log(`Server count posted! ${client.guilds.size}`);
})
dbl.on('error', e => {
 console.log(e);
})

client.login(token);

// Ready check
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Set bot's playing status
  client.user.setActivity("with an Everstone, //info")
  .then(console.log("Successful set activity"))
  .catch(console.error);

});


// Prefix for commands
const prefix = '//';

// Creator's mention (ME!)
// No need to hide this since anyone can just turn on dev mode and right click -> Copy ID
const creator_id = 184111117650493440;

// My imports
require('./js/listeners/message_listener.js')(Discord, client, request, prefix, creator_id);
