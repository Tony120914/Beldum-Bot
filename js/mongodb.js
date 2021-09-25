require('dotenv').config()
const { MongoClient } = require("mongodb");
const { mongodb_collections } = require('../config.json');
const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../config.json');
const log = require('./logger').getLogger();

const uri = process.env.MONGODBKEY;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var database;
var reminder_stream;

module.exports = {
  connect: async () => {
    await client.connect();
    database = client.db(); // db name in connection string

    // streams
    reminder_stream = database.collection(mongodb_collections.reminders).watch();
  },

  getDb: () => {
    return database;
  },

  getCollection: (collection_name) => {
    return database.collection(collection_name);
  },

  getReminderDateStream: () => {
    return reminder_stream;
  },

  triggerOnReminderDate: (discord_client) => {
    reminder_stream.on("change", async next => {
      if (next && next.operationType == "delete") {

        // find the reminder clone that was just deleted from TTL to recover data
        const reminders_clone = database.collection(mongodb_collections.reminders_clone);
        const query = { _id: next.documentKey._id };
        const reminder = await reminders_clone.findOne(query);
  
        if (reminder) {
          const channel = discord_client.channels.cache.find(channel => channel.id == reminder.channel_id);
          if (channel) { // prevent shards not responsible for this channel to ignore
            const embed = new MessageEmbed()
              .setAuthor(`Reminder`)
              .setDescription(`${reminder.reminder}`)
              .addField('Datetime', `${reminder.date.toDateString()} ${reminder.date.toLocaleTimeString()}`)
              .setColor(default_embed_color);
            channel.send({ content: `<@${reminder.user_id}>`, embeds: [embed] });
            log.info(`Reminder triggered to user ${reminder.user_id} in channel ${reminder.channel_id}`)

            // remove the copy reminder as well
            await reminders_clone.deleteOne(query)
          }
        }

      }
    });
  }

}
