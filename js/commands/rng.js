
// Command for "//rng num1,num2"
module.exports = (Discord, message, prefix) => {

  let comma_index = message.content.indexOf(',');

  let num1 = message.content.substring((prefix + 'rng ').length, comma_index);
  num1 = parseInt(num1);

  let num2 = message.content.substring(comma_index + 1);
  num2 = parseInt(num2);

  if (comma_index == -1 || isNaN(num1) || isNaN(num2)) {
    message.reply(`_Beldum Beldum_ :anger: \`(Use it like this: ${prefix}rng n1,n2)\``)
    .then(console.log("Successful error reply"))
    .catch(console.error);
    return;
  }

  let min = 0;
  let max = 0;
  if (num1 < num2) {
    min = num1;
    max = num2;
  }
  else {
    min = num2;
    max = num1;
  }

  // Inclusive random integers from Math.random() MDN web docs
  let random = Math.floor(Math.random() * (max - min + 1)) + min;

  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/dice.png?raw=true')
  .setAuthor('Random Number Generator')
  .addField('From', min, true)
  .addField('To', max, true)
  .addField('Result', `\`${random}\``, true)
  ;

  message.channel.send(rich_embed)
  .then(console.log('Successful random number generated'))
  .catch(console.error);

}
