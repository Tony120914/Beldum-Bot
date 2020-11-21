const { MessageEmbed } = require("discord.js");
const { prefix, default_embed_color } = require('../../config.json');
const { Reply_Successful_Command, Reply_Usage_Error, Get_Random_Int } = require('../utilities.js');

module.exports = {
  name: 'rps',
  aliases: ['roshambo'],
  description: 'Play rock paper scissors with Beldum-Bot.\n\nr = rock\np = paper\ns = scissors',
  args: true,
  usage: '<r or p or s>',
  examples: `${prefix}rps r\n${prefix}rps p\n${prefix}rps s`,

  execute(message, arguments) {

    // rock paper scissors object
    const rps = [
      {
        names: ['r', 'rock'],
        emoji: ":rock:",
        strong_against: 2,
        weak_against: 1,
        tie_against: 0
      },
      {
        names: ['p', 'paper'],
        emoji: ":roll_of_paper:",
        strong_against: 0,
        weak_against: 2,
        tie_against: 1
      },
      {
        names: ['s', 'scissors'],
        emoji: ":scissors:",
        strong_against: 1,
        weak_against: 0,
        tie_against: 2
      }
    ];

    // win, lose, tie messages
    const win = ':boom: _it\'s super effective!_';
    const lose = ':skull: _it\'s not very effective..._';
    const tie = ':zzz: _but nothing happened._';

    // User input validity check
    const user_index = rps.findIndex(item => item.names.includes(arguments[0]));
    if (rps[user_index]) {
      const bot_index = Get_Random_Int(0, 2);
      let result;
      if (rps[user_index].strong_against == bot_index) result = win;
      else if (rps[user_index].weak_against == bot_index) result = lose;
      else if (rps[user_index].tie_against == bot_index) result = tie;

      const embed = new MessageEmbed()
      .setAuthor(`Rock-Paper-Scissors`)
      .addField('You used', rps[user_index].emoji, true)
      .addField('Beldum used', rps[bot_index].emoji, true)
      .addField('Result', result)
      .setColor(default_embed_color);

      Reply_Successful_Command(embed, message);
      
      return embed;
    }
    else {
      return Reply_Usage_Error(message, this.name, this.usage);
    }

  }
}
