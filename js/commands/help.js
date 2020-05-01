
// Command for "//help"
module.exports = (Discord, message, prefix) => {

  // In format of [[command name, command description], ...]
  var array_of_commands = [
    ['8ball question...', 'Ask the magic 8ball a question'],
    ['avatar @user', 'Show user\'s avatar (full res)'],
    ['emoji :emoji:', 'Show custom emoji (full res)'],
    ['flip', 'Flip a coin'],
    ['google keywords...', 'Google search your keywords'],
    ['help', 'Show list of commands'],
    ['icon', 'Show server icon (full res)'],
    ['info', 'Show Beldum-Bot\'s info'],
    ['ping', 'Show Beldum-Bot\'s ping'],
    ['report', 'Show how to report a bug'],
    ['rng n1,n2', 'Random number between n1 and n2'],
    ['rps r or p or s', 'Play rock paper scissors with bot'],
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
  .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/479Rotom-Pok%C3%A9dex.png?raw=true')
  .setAuthor('Beldum-Bot', 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/Bag_Ultra_Ball_Sprite.png?raw=true')
  .addBlankField(false)
  .setDescription('[Rotom-Dex](https://bulbapedia.bulbagarden.net/wiki/Rotom_Pok%C3%A9dex) to the rescue!')
  .addField('Commands', `\`${commands}\``, true)
  .addField('Descriptions', `\`${descs}\``, true)
  .addBlankField(false)
  .addField('Need more info?', 'Use //info', true)
  .addField('Need more help with commands?', 'Visit [here](https://github.com/Tony120914/Beldum-Bot) or [here](https://discordbots.org/bot/454764425090433034)' + '\n' +
            'to view more detailed descriptions' + '\n' +
            'and usage examples of commands!'
            , true)
  .setTimestamp();
  ;

  // Send RichEmbed message
  message.channel.send(rich_embed)
  .then(console.log(`Successful command reply to ${message.content}`))
  .catch(console.error);
  return rich_embed;

}
