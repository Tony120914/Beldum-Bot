
// Command for "//help"
module.exports = (Discord, message, prefix) => {

  // In format of [[command name, command description], ...]
  var array_of_commands = [
    [prefix + 'avatar @user', 'Show user\'s avatar url'],
    [prefix + 'emoji :emoji:', 'Show custom emoji\'s url'],
    [prefix + 'google keywords...', 'Google search your keywords'],
    [prefix + 'help', 'Show info and list of commands'],
    [prefix + 'ping', 'Show Beldum-Bot\'s ping'],
    [prefix + 'rng n1,n2', 'Random number between n1 and n2'],
    [prefix + 'rps r or p or s', 'Play rock paper scissors with bot'],
    [prefix + 'server icon', 'Show server icon\'s url'],
    [prefix + 'tictactoe @p1 @p2', 'Play tictactoe with another user'],
    [prefix + 'youtube keywords...', 'YouTube search your keywords']
  ];

  // formatted string holding the array_of_commands to reply
  let commands = '';
  let descs = '';
  for (let i = 0; i < array_of_commands.length; i++) {
    commands += array_of_commands[i][0] + '\n';
    descs += array_of_commands[i][1] + '\n';
  }

  // RichEmbed to get that awesome style
  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .setThumbnail('https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/374Beldum-Shiny.png')
  .setAuthor('Beldum-Bot', 'https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/Bag_Ultra_Ball_Sprite.png')
  .addBlankField(false)
  .setDescription('Holding an [_Everstone_](https://bulbapedia.bulbagarden.net/wiki/Everstone)')
  .addField('Commands', `\`${commands}\``, true)
  .addField('Descriptions', `\`${descs}\``, true)
  .addBlankField(false)
  .addField('Source code', '[GitHub](https://github.com/Tony120914/Beldum-Bot)', false)
  .setTimestamp();
  ;

  // Send RichEmbed message
  message.channel.send(rich_embed)
  .then(console.log("Successful help reply"))
  .catch(console.error);

}
