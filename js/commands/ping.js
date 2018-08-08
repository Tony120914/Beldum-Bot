
// Command for "//ping"
module.exports = (message, client) => {

  let ping = Math.round(client.ping);

  message.reply(ping + 'ms')
  .then(console.log(`Successful command reply to ${message.content}`))
  .catch(console.error);
  return ping;
}
