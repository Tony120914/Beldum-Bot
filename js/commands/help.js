
// Command for "//help"
module.exports = (Discord, message, prefix) => {

  // In format of [[command name, command description], ...]
  var array_of_commands = [
    ['8ball question...', 'Ask the magic 8ball a question'],
    ['avatar @user', 'Show user\'s avatar url'],
    ['emoji :emoji:', 'Show custom emoji\'s url'],
    ['google keywords...', 'Google search your keywords'],
    ['help', 'Show info and list of commands'],
    ['ping', 'Show Beldum-Bot\'s ping'],
    ['rng n1,n2', 'Random number between n1 and n2'],
    ['rps r or p or s', 'Play rock paper scissors with bot'],
    ['server icon', 'Show server icon\'s url'],
    ['tictactoe @p1 @p2', 'Play tic tac toe with another user'],
    ['ud keywords...', 'Urban Dict. (no keywords = random)'],
    ['youtube keywords...', 'YouTube search your keywords'],
  ];

  // formatted string holding the array_of_commands to reply
  let commands = '';
  let descs = '';
  for (let i = 0; i < array_of_commands.length; i++) {
    commands += prefix + array_of_commands[i][0] + '\n';
    descs += array_of_commands[i][1] + '\n';
  }

  // RichEmbed to get that awesome style
  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .setThumbnail('https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/374Beldum-Shiny.png')
  .setAuthor('Beldum-Bot', 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/Bag_Ultra_Ball_Sprite.png?raw=true')
  .addBlankField(false)
  .setDescription('Holding an [Everstone](https://bulbapedia.bulbagarden.net/wiki/Everstone)')
  .addField('Commands', `\`${commands}\``, true)
  .addField('Descriptions', `\`${descs}\``, true)
  .addBlankField(false)
  .addField('Are you enjoying Beldum-bot?', 'Click [here](https://discordapp.com/api/oauth2/authorize?client_id=454764425090433034&permissions=347200&scope=bot) to invite Beldum-Bot to another server!' + '\n' +
                                            'Click [here](https://discordbots.org/bot/454764425090433034/vote) to vote for Beldum-Bot daily!', true)
  .addField('Source code', '[GitHub](https://github.com/Tony120914/Beldum-Bot)', true)
  .setTimestamp();
  ;

  // Send RichEmbed message
  message.channel.send(rich_embed)
  .then(console.log("Successful help reply"))
  .catch(console.error);

}
