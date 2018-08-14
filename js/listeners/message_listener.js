
// Event listener for messages
module.exports = (Discord, client, request, prefix, creator_id) => {

  // Listen on message
  client.on('message', message => {

    const prefix_mention = `<@${client.user.id}>`;

    // Ignore bots, and must be valid guild
    if (message.author.bot || message.guild == null || !message.guild.available) {
      return;
    }

    // Starting with prefix "//"
    else if (message.content.startsWith(prefix)) {

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

      // Command for "//flip"
      else if (command == 'flip') {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/flip.js')(Discord, message, prefix);
      }

      // Command for "//info"
      else if (command == 'info') {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/info.js')(Discord, client, message, prefix, creator_id);
      }

      // Command for "//report"
      else if (command == 'report') {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/report.js')(Discord, message, prefix, creator_id);
      }

    }

    // Starting with prefix "@Beldum-Bot"
    else if (message.content.startsWith(prefix_mention)) {

      // @bot mention by anyone (no args)
      if (message.content == prefix_mention) {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../commands/@bot.js')(message);
      }

      // Admin commands below

      // stop here if user is not admin
      if (message.author.id != creator_id) return;

      let command = message.content.substring(prefix_mention.length + 1);

      // Command for "@bot tell @name... "message""
      if (command.startsWith('tell')) {
        if (!require('../helpers/check_permissions.js')(client, message)) return;
        require('../admin_commands/tell.js')(client, message);
      }

    }

  });

}
