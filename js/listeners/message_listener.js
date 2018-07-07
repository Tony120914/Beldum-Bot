
// Event listener for messages
module.exports = (client, prefix) => {

  // Listen on message
  client.on('message', message => {
    // Starting with prefix "//"
    if (message.content.startsWith(prefix)) {

      let command = message.content.substring(prefix.length);

      // Command for "//help"
      if (command == 'help') {
        require('../commands/help.js')(message);
      }

      // Command for "//avatar @name"
      else if (command.startsWith('avatar')) {
        require('../commands/avatar.js')(message);
      }

      // Command for "//emoji :custom emoji:"
      else if (command.startsWith('emoji')) {
        require('../commands/emoji.js')(message);
      }

      // Command for "//server icon"
      else if (command == 'server icon') {
        require('../commands/server_icon.js')(message);
      }

      else if (command == 'ping') {
        require('../commands/ping.js')(message, client);
      }

      // No such command
      else {
        message.reply('_Beldum Beldum_ :anger: \`(Command does not exist. Use //help to search for commands.)\`')
        .then(console.log("Successful error reply"))
        .catch(console.error);
      }
    }
  });

}
