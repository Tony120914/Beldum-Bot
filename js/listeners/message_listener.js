
// Event listener for messages
module.exports = (Discord, client, prefix) => {

  // Listen on message
  client.on('message', message => {
    // Starting with prefix "//" and ignore other bots
    if (message.content.startsWith(prefix) && !message.author.bot) {

      let command = message.content.substring(prefix.length);

      // Command for "//help"
      if (command == 'help') {
        if (!have_all_permissions(client, message)) return;
        require('../commands/help.js')(Discord, message, prefix);
      }

      // Command for "//avatar @name"
      else if (command.startsWith('avatar')) {
        if (!have_all_permissions(client, message)) return;
        require('../commands/avatar.js')(message, prefix);
      }

      // Command for "//emoji :custom emoji:"
      else if (command.startsWith('emoji')) {
        if (!have_all_permissions(client, message)) return;
        require('../commands/emoji.js')(message, prefix);
      }

      // Command for "//server icon"
      else if (command == 'server icon') {
        if (!have_all_permissions(client, message)) return;
        require('../commands/server_icon.js')(message);
      }

      // Command for "//ping"
      else if (command == 'ping') {
        if (!have_all_permissions(client, message)) return;
        require('../commands/ping.js')(message, client);
      }

      // Command for "//rng num1,num2"
      else if (command.startsWith('rng')) {
        if (!have_all_permissions(client, message)) return;
        require('../commands/rng.js')(Discord, message, prefix);
      }

      // Command for "//google keywords..."
      else if (command.startsWith('google')) {
        if (!have_all_permissions(client, message)) return;
        require('../commands/google.js')(Discord, message, prefix);
      }

      // Command for "//youtube keywords..."
      else if (command.startsWith('youtube')) {
        if (!have_all_permissions(client, message)) return;
        require('../commands/youtube.js')(Discord, message, prefix);
      }

      // Command for "//rps r or p or s"
      else if (command.startsWith('rps')) {
        if (!have_all_permissions(client, message)) return;
        require('../commands/rps.js')(Discord, message, prefix);
      }

      // Command for "//tictactoe @player1 @player2"
      else if (command.startsWith('tictactoe')) {
        if (!have_all_permissions(client, message)) return;
        require('../commands/tictactoe.js')(Discord, message, client, prefix);
      }

      // No such command
      // else {
      //   message.reply('_Beldum Beldum_ :anger: \`(Command does not exist. Use //help to search for commands.)\`')
      //   .then(console.log("Successful error reply"))
      //   .catch(console.error);
      // }
    }
  });

  const required_permissions = new Map([
    ['VIEW_CHANNEL', ' Read Text Channels & See Voice Channels'],
    ['SEND_MESSAGES', ' Send Messages'],
    ['EMBED_LINKS', ' Embed Links'],
    ['READ_MESSAGE_HISTORY', ' Read Message History'],
    ['USE_EXTERNAL_EMOJIS', ' Use External Emojis'],
    ['ADD_REACTIONS', ' Add Reactions'],
  ]);

  // Helper functions to ensure bot is granted required permissions:
  function have_all_permissions(client, message) {

    let missing_permissions = message.guild.members.get(client.user.id).missingPermissions(Array.from(required_permissions.keys()));

    for (let i = 0; i < missing_permissions.length; i++) {
      missing_permissions[i] = required_permissions.get(missing_permissions[i]);
    }

    if (missing_permissions.length != 0) {
        message.reply('_Beldum Beldum_ :warning:\n\n' +
                      '\`Beldum-Bot may at one point need the following permissions to function properly.\`\n\n' +
                      missing_permissions + '\n\n' +
                      '\`Please update Beldum-Bot\'s role in (Server Settings -> Roles), ' +
                      'or reinvite the bot using the updated invite link found here:\` https://discordbots.org/bot/454764425090433034')
        .then(console.log("Successful missing permissions reply"))
        .catch(console.error);
        return false;
    }
    return true;
  }

}
