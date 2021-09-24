// Acquire token from .env
require('dotenv').config()

const token = process.env.TOKEN;
const { ShardingManager } = require('discord.js');

// Sharding required for 2500+ servers
sharding_manager = new ShardingManager('./js/bot.js', { token: token });
sharding_manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
sharding_manager.spawn();
