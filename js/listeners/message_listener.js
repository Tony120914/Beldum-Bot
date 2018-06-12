
// Event listener for messages
module.exports = (client, prefix) => {

  // Listen on message
  client.on('message', msg => {
    // Starting with prefix "//"
    if (msg.content.startsWith(prefix)) {

      // Command for "//help"
      if (msg.content.substring(prefix.length) == 'help') {
        require('../commands/help.js')(msg);
      }

      // No such command
      else {
        msg.reply('_Beldum Beldum_ :anger: \`(Command does not exist. Use //help to search for commands.)\`');
      }
    }
  });

}
