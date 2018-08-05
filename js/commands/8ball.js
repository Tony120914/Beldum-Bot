
// Command for "//8ball question"
module.exports = (Discord, message, prefix) => {

  if (message.content == (prefix + '8ball')) {
    let log = `Successful error reply to ${message.content}`;
    message.reply(`_Beldum Beldum_ :anger: \`You didn't ask any questions!\``)
    .then(console.log(log))
    .catch(console.error);
    return log;
  }

  const answers = [
    // Yes - answers
    'Oh yeah, 100%',
    'Very likely',
    'Science says yes',
    '_Beldum interrupts_ **AFFIRMATIVE.**',

    // Maybe - answers
    'Maybe...',
    '_Beldum interrupts_ **INDETERMINATE**',

    // No - answers
    'Hahaha. No.',
    'Only in your wildest dreams',
    'Probably not',
    '_Beldum interrupts_ **NEGATIVE.**',
  ];

  let min = 0;
  let max = answers.length - 1;
  // Inclusive random integers from Math.random() MDN web docs
  let random = Math.floor(Math.random() * (max - min + 1)) + min;

  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .addField(':8ball: The Magic 8-ball', answers[random], false)
  ;

  message.channel.send(rich_embed)
  .then(console.log(`Successful command reply to ${message.content}`))
  .catch(console.error);
  return rich_embed;

}
