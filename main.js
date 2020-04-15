
// Acquire token from .env
require('dotenv').config()
const token = process.env.TOKEN;

// Init
const Discord = require('discord.js');

// Sharding required for 2500+ servers
sharding_manager = new Discord.ShardingManager('./bot.js', { token: token });
sharding_manager.spawn();
sharding_manager.on('launch', shard => console.log(`Launched shard ${shard.id}`));
