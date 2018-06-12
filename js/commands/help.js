
// Command for "//help"
module.exports = (message) => {

  // In format of [[command name, command description], ...]
  var array_of_commands = [
    ['//avatar', 'Displays a user\'s avatar image. <//avatar @name>'],
    ['//help', 'Shows a list of commands with description.']
  ];

  // formatted string holding the array_of_commands to reply
  let result = 'List of commands:\n';
  for (let i = 0; i < array_of_commands.length; i++) {
    result += array_of_commands[i][0] + ' : ' + array_of_commands[i][1] + '\n';
  }

  message.reply('_Beldum Beldum_ :question:\n' + '\`' + result + '\`');

}
