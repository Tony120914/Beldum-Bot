
module.exports = (client, prefix) => {

  // Help commands
  client.on('message', msg => {
    if (msg.content.startsWith(prefix)) {

      // Help
      if (msg.content.substring(prefix.length) == 'help') {
        msg.reply('\`nothing for now...\`');
      }

      // No such command
      else {
        msg.reply('_Beldum Beldum_ :anger: \`(Command does not exist. Use //help to search for commands.)\`');
      }
    }
  });

}
