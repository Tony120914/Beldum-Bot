
// Command for "//help"
module.exports = (message) => {

  // In format of [[command name, command description], ...]
  var array_of_commands = [
    ['//avatar @name', 'Shows the user\'s avatar image url.'],
    ['//emoji :custom emoji:', 'Shows the custom emoji\'s image url.'],
    ['//help', 'Shows the list of commands with its description.'],
    ['//server icon', 'Shows the server\'s icon url.']
  ];

  // formatted string holding the array_of_commands to reply
  let result = 'List of commands:\n';
  for (let i = 0; i < array_of_commands.length; i++) {
    result += array_of_commands[i][0] + ' : ' + array_of_commands[i][1] + '\n';
  }

  message.reply('_Beldum Beldum_ :question:\n' + '\`' + result + '\`')
  .then(console.log("Successful help error reply"))
  .catch(console.error);

}
