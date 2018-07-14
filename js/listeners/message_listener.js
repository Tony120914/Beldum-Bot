
// Event listener for messages
module.exports = (Discord, client, request, prefix) => {

  // Listen on message
  client.on('message', message => {
    // Starting with prefix "//" and ignore other bots
    if (message.content.startsWith(prefix) && !message.author.bot) {

      let command = message.content.substring(prefix.length);

      // Command for "//help"
      if (command == 'help') {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/help.js')(Discord, message, prefix);
      }

      // Command for "//avatar @name"
      else if (command.startsWith('avatar')) {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/avatar.js')(Discord, message, prefix);
      }

      // Command for "//emoji :custom emoji:"
      else if (command.startsWith('emoji')) {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/emoji.js')(Discord, message, prefix);
      }

      // Command for "//icon"
      else if (command == 'icon') {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/icon.js')(Discord, message, prefix);
      }

      // Command for "//ping"
      else if (command == 'ping') {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/ping.js')(message, client);
      }

      // Command for "//rng num1,num2"
      else if (command.startsWith('rng')) {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/rng.js')(Discord, message, prefix);
      }

      // Command for "//google keywords..."
      else if (command.startsWith('google')) {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/google.js')(Discord, message, prefix);
      }

      // Command for "//youtube keywords..."
      else if (command.startsWith('youtube')) {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/youtube.js')(Discord, message, prefix);
      }

      // Command for "//rps r or p or s"
      else if (command.startsWith('rps')) {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/rps.js')(Discord, message, prefix);
      }

      // Command for "//tictactoe @player1 @player2"
      else if (command.startsWith('tictactoe')) {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/tictactoe.js')(Discord, message, client, prefix);
      }

      // Command for "//8ball question..."
      else if (command.startsWith('8ball')) {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/8ball.js')(Discord, message, prefix);
      }

      // Command for "//ud [keywords...]"
      else if (command.startsWith('ud')) {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/ud.js')(Discord, request, message, prefix);
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
