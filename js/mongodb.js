require('dotenv').config()
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODBKEY;
const client = new MongoClient(uri, { useUnifiedTopology: true });
var database;

module.exports = {
  connect: async () => {
    await client.connect();
    database = client.db(); // db name in connection string
  },

  get_db: () => {
    return database;
  },

  get_collection: (collection_name) => {
    return database.collection(collection_name);
  },

}
