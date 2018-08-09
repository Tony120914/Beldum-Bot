
// Command for ""//rps"
module.exports = (Discord, message, prefix) => {

  // Rock, paper, scissors
  const rps_emojis = [':new_moon:',
               ':newspaper:',
               ':scissors:'
              ];
  // Win, Lose, Tie
  const results = ['_it\'s super effective!_',
                   '_it\'s not very effective..._',
                   '_but nothing happened..._'
                  ];

  let user_choice = message.content.substring((prefix + 'rps ').length);

  // Validity check
  if (user_choice != 'r' && user_choice != 'p' && user_choice != 's') {
    let log = `Successful error reply to ${message.content}`;
    message.reply(`_Beldum Beldum_ :anger: \`(Use it like this: ${prefix}rps r or p or s\``)
    .then(console.log(log))
    .catch(console.error);
    return log;
  }

  // Convert r/p/s to emoji variant
  if (user_choice == 'r') {
    user_choice = rps_emojis[0];
  }
  else if (user_choice == 'p') {
    user_choice = rps_emojis[1];
  }
  else if (user_choice == 's') {
    user_choice = rps_emojis[2];
  }

  // Randomly choose rps for bot
  let min = 0;
  let max = 2;
  // Inclusive random integers from Math.random() MDN web docs
  let bot_choice = rps_emojis[Math.floor(Math.random() * (max - min + 1)) + min];

  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/rps.PNG?raw=true')
  .setAuthor('Rock-paper-scissors')
  .addField('You used', user_choice, true)
  .addField('Beldum used', bot_choice, true)
  ;

  // Case 1: user wins
  if (user_choice == rps_emojis[0] && bot_choice == rps_emojis[2] ||
      user_choice == rps_emojis[2] && bot_choice == rps_emojis[1] ||
      user_choice == rps_emojis[1] && bot_choice == rps_emojis[0]) {
        rich_embed.addField('Result', results[0], true);
  }

  // Case 2: bot wins
  else if (user_choice == rps_emojis[0] && bot_choice == rps_emojis[1] ||
           user_choice == rps_emojis[1] && bot_choice == rps_emojis[2] ||
           user_choice == rps_emojis[2] && bot_choice == rps_emojis[0]) {
             rich_embed.addField('Result', results[1], true);
  }

  // Case 3: tie
  else {
    rich_embed.addField('Result', results[2], true);
  }

  // Send RichEmbed
  message.channel.send(rich_embed)
  .then(console.log(`Successful command reply to ${message.content}`))
  .catch(console.error);
  return rich_embed;

}
