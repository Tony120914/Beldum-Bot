
// Acquire token from .env
require('dotenv').config()
const token = process.env.TOKEN;

// Init discord
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(token);

// Ready check
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Example testing
client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});
