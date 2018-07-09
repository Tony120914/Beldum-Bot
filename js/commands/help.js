
// Command for "//help"
module.exports = (message) => {

  // In format of [[command name, command description], ...]
  var array_of_commands = [
    ['//avatar @name\t\t\t', 'Shows the user\'s avatar image url.'],
    ['//emoji :custom emoji:\t', 'Shows the custom emoji\'s image url.'],
    ['//google keywords...  \t', 'Performs a Google search with your keywords.'],
    ['//help\t\t\t\t\t', 'Shows the list of commands with its description.'],
    ['//ping\t\t\t\t\t', 'Shows Beldum-Bot\'s ping.'],
    ['//rng num1,num2   \t\t', 'Randomly generates a number between num1 and num2.'],
    ['//rps r or p or s \t\t', 'Play rock, paper, scissors with Beldum-bot.'],
    ['//server icon \t\t\t', 'Shows the server\'s icon url.'],
    ['//youtube keywords... \t', 'Performs a YouTube search with your keywords.']
  ];

  // formatted string holding the array_of_commands to reply
  let result = 'List of commands:\n';
  for (let i = 0; i < array_of_commands.length; i++) {
    result += array_of_commands[i][0];
    result += array_of_commands[i][1] + '\n';
  }

  message.reply('_Beldum Beldum_ :question:\n' + '\`' + result + '\`')
  .then(console.log("Successful help reply"))
  .catch(console.error);

}
