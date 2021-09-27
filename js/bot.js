require('dotenv').config()
const { Client, Intents, Collection, Options, LimitedCollection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const mongodb = require('./mongodb.js');
const log = require('./logger').getLogger();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
	makeCache: Options.cacheWithLimits({
    ...Options.defaultMakeCacheSettings,
		MessageManager: 0,
		PresenceManager: 0,
    ThreadManager: 0,
    GuildBanManager: 0,
    VoiceStateManager: 0,
    GuildInviteManager: 0,
    ThreadMemberManager: 0,
    GuildStickerManager: 0,
    StageInstanceManager: 0
	})
});

// Listen on any unhandled promise rejection
process.on('unhandledRejection', error => {
	log.error('Unhandled promise rejection:', error);
});

if (process.env.LIVE) {
  // Posting server count for top.gg
  const DBL = require("dblapi.js");
  const dbl = new DBL(process.env.TOKEN_TOPGG, client);

  dbl.on('posted', () => {
    log.info(`Server count posted for shard ${client.shard.ids}.`);
  })
  dbl.on('error', e => {
    log.error(e);
  })
}

// Event handler: read event js files dynamically
const event_files = fs.readdirSync(path.resolve(__dirname, './events')).filter(file => file.endsWith('.js'));
for (const file of event_files) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Command handler: read command js files dynamically
client.commands = new Collection();
const command_files = fs.readdirSync(path.resolve(__dirname, './commands')).filter(file => file.endsWith('.js'));
for (const file of command_files) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command)
}

client.login(process.env.TOKEN)

// Connect to MongoDB
mongodb.connect()
  .then(() => log.info(`Shard ${client.shard.ids} has connected to MongoDB`))
  .then(() => mongodb.triggerOnReminderDate(client))
  .catch(err => log.error(err));



