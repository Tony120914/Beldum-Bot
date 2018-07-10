
// Command for "//help"
module.exports = (message, prefix) => {

  // In format of [[command name, command description], ...]
  var array_of_commands = [
    [prefix + 'avatar @name\t\t\t\t\t', 'Shows the user\'s avatar image url.'],
    [prefix + 'emoji :custom emoji:\t\t\t', 'Shows the custom emoji\'s image url.'],
    [prefix + 'google keywords...  \t\t\t', 'Performs a Google search with your keywords.'],
    [prefix + 'help\t\t\t\t\t\t\t', 'Shows the list of commands with its description.'],
    [prefix + 'ping\t\t\t\t\t\t\t', 'Shows Beldum-Bot\'s ping.'],
    [prefix + 'rng num1,num2   \t\t\t\t', 'Randomly generates a number between num1 and num2.'],
    [prefix + 'rps r or p or s \t\t\t\t', 'Play rock, paper, scissors with Beldum-bot.'],
    [prefix + 'server icon \t\t\t\t\t', 'Shows the server\'s icon image url.'],
    [prefix + 'tictactoe @player1 @player2 \t', 'Play tictactoe with another user via reactions.'],
    [prefix + 'youtube keywords... \t\t\t', 'Performs a YouTube search with your keywords.']
  ];

  // formatted string holding the array_of_commands to reply
  let result = 'List of commands:\n';
  for (let i = 0; i < array_of_commands.length; i++) {
    result += array_of_commands[i][0];
    result += array_of_commands[i][1] + '\n';
  }

  message.reply('_Beldum Beldum_ :question:\n'
                + `\`${result}\``)
  .then(console.log("Successful help reply"))
  .catch(console.error);

}
