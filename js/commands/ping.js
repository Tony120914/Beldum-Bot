
// Command for "//ping"
module.exports = (message, client) => {
  
  message.reply(client.ping + 'ms')
  .then(console.log("Successful ping"))
  .catch(console.error);
}
