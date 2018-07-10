
// Command for "//ping"
module.exports = (message, client) => {

  message.reply(Math.round(client.ping) + 'ms')
  .then(console.log("Successful ping"))
  .catch(console.error);
}
