
// Event listener for messages
module.exports = (client, prefix) => {

  // Listen on message
  client.on('message', message => {
    // Starting with prefix "//" and ignore other bots
    if (message.content.startsWith(prefix) && !message.author.bot) {

      let command = message.content.substring(prefix.length);

      // Command for "//help"
      if (command == 'help') {
        require('../commands/help.js')(message, prefix);
      }

      // Command for "//avatar @name"
      else if (command.startsWith('avatar')) {
        require('../commands/avatar.js')(message, prefix);
      }

      // Command for "//emoji :custom emoji:"
      else if (command.startsWith('emoji')) {
        require('../commands/emoji.js')(message, prefix);
      }

      // Command for "//server icon"
      else if (command == 'server icon') {
        require('../commands/server_icon.js')(message);
      }

      // Command for "//ping"
      else if (command == 'ping') {
        require('../commands/ping.js')(message, client);
      }

      // Command for "//rng num1,num2"
      else if (command.startsWith('rng')) {
        require('../commands/rng.js')(message, prefix);
      }

      // Command for "//google keywords..."
      else if (command.startsWith('google')) {
        require('../commands/google.js')(message, prefix);
      }

      // Command for "//youtube keywords..."
      else if (command.startsWith('youtube')) {
        require('../commands/youtube.js')(message, prefix);
      }

      // Command for "//rps r or p or s"
      else if (command.startsWith('rps')) {
        require('../commands/rps.js')(message, prefix);
      }

      // Command for "//tictactoe @player1 @player2"
      else if (command.startsWith('tictactoe')) {
        require('../commands/tictactoe.js')(message, client, prefix);
      }

      // No such command
      // else {
      //   message.reply('_Beldum Beldum_ :anger: \`(Command does not exist. Use //help to search for commands.)\`')
      //   .then(console.log("Successful error reply"))
      //   .catch(console.error);
      // }
    }
  });

}
