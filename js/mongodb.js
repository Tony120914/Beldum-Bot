require('dotenv').config()
const { MongoClient } = require("mongodb");
const { collections } = require('../config.json');

const uri = process.env.MONGODBKEY;
const client = new MongoClient(uri, { useUnifiedTopology: true });
var database;
var reminder_date_stream;

module.exports = {
  connect: async () => {
    await client.connect();
    database = client.db(); // db name in connection string

    // streams
    reminder_date_stream = database.collection(collections.reminders).watch();
  },

  get_db: () => {
    return database;
  },

  get_collection: (collection_name) => {
    return database.collection(collection_name);
  },

  get_reminder_date_stream: () => {
    return reminder_date_stream;
  },

  trigger_on_reminder_date: (discord_client) => {
    reminder_date_stream.on("change", async next => {
      if (next && next.operationType == "delete") {

        // find the reminder clone that was just deleted from TTL to recover data
        const reminders_clone = database.collection(collections.reminders_clone);
        const query = { _id: next.documentKey._id };
        const reminder = await reminders_clone.findOne(query);
  
        if (reminder) {
          const channel = discord_client.channels.cache.find(channel => channel.id == reminder.channel_id);
          if (channel) { // prevent shards not responsible for this channel to ignore
            channel.send(`<@${reminder.user_id}> \n>>> ${reminder.reminder}`)
            .then(() => console.log("Successful reminder trigger and message"))
            .catch(console.err);

            await reminders_clone.deleteOne(query)
            .then(() => console.log("Successful deletion of copy reminder"))
            .catch(console.err);
          }
        }

      }
    });
  }

}
