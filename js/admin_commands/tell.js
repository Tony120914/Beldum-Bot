
// Command for "//@bot tell @name "message">"
module.exports = (client, message) => {

  // map of @mentions in the message
  let map_of_mentions = message.mentions.users;
  map_of_mentions.delete(client.user.id); // delete this bot's mention in map

  // turn into array
  let array_of_mentions = map_of_mentions.array();

  // At least 1 mention
  if (array_of_mentions.length >= 1) {

    let reply = "";
    for (let i = 0; i < array_of_mentions.length; i++) {
      reply += array_of_mentions[i] + " ";
    }

    start_quote = message.content.indexOf("\"");
    end_quote = message.content.indexOf("\"", start_quote + 1);
    if (start_quote == -1 || end_quote == -1) return;

    reply += message.content.substring(start_quote + 1, end_quote);

    message.channel.send(reply)
    .then(console.log(`Successful command reply to ${message.content}`))
    .catch(console.error);
    return reply;
  }

}
