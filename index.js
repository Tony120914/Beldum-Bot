const { ShardingManager } = require('discord.js');
const log = require('./js/logger').getLogger();
require('dotenv').config()

// Sharding required for 2500+ servers
const sharding_manager = new ShardingManager('./js/bot.js', { token: process.env.TOKEN });
sharding_manager.on('shardCreate', shard => log.info(`Launched shard ${shard.id}`));
sharding_manager.spawn();
