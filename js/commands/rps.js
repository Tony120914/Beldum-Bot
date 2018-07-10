
// Command for ""//rps"
module.exports = (Discord, message, prefix) => {

  // Rock, paper, scissors
  let rps = [':new_moon:', ':newspaper:', ':scissors:']

  let user_choice = message.content.substring((prefix + 'rps ').length);

  // Validity check
  if (user_choice != 'r' && user_choice != 'p' && user_choice != 's') {
    message.reply(`_Beldum Beldum_ :anger: \`(Use it like this: ${prefix}rps r or p or s\``)
    .then(console.log("Successful error reply"))
    .catch(console.error);
    return;
  }

  // Convert r/p/s to emoji variant
  if (user_choice == 'r') {
    user_choice = rps[0];
  }
  else if (user_choice == 'p') {
    user_choice = rps[1];
  }
  else if (user_choice == 's') {
    user_choice = rps[2];
  }

  // Randomly choose rps for bot
  // Inclusive random integers from Math.random() MDN web docs
  let bot_choice = rps[Math.floor(Math.random() * (2 - 0 + 1)) + 0];

  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/rps.PNG?raw=true')
  .setAuthor('Rock-paper-scissors')
  .addField('You used', user_choice, true)
  .addField('Beldum used', bot_choice, true)
  ;

  // Case 1: user wins
  if (user_choice == rps[0] && bot_choice == rps[2] ||
      user_choice == rps[2] && bot_choice == rps[1] ||
      user_choice == rps[1] && bot_choice == rps[0]) {
        rich_embed.addField('Result', '_it\'s super effective!_', true);
  }

  // Case 2: bot wins
  else if (user_choice == rps[0] && bot_choice == rps[1] ||
           user_choice == rps[1] && bot_choice == rps[2] ||
           user_choice == rps[2] && bot_choice == rps[0]) {
             rich_embed.addField('Result', '_it\'s not very effective..._', true);
  }

  // Case 3: tie
  else {
    rich_embed.addField('Result', '_but nothing happened..._', true);

  }

  // Send RichEmbed
  message.channel.send(rich_embed)
  .then(console.log("Successful rps user win"))
  .catch(console.error);

}
