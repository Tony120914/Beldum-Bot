const { MessageEmbed } = require("discord.js");
const { prefix, default_embed_color } = require('../../config.json');
const { Get_Random_Int, Reply_Successful_Command } = require('../utilities.js');

module.exports = {
  name: 'flip',
  aliases: ['coin', 'toss'],
  description: 'Toss a coin, heads or tails.\n(Fun fact: there is a 1/6000 chance of a coin landing on its edge.)',
  args: false,
  usage: '',
  examples: `${prefix}flip`,

  execute(message, arguments) {

    let result;
    let image;
    const random = Get_Random_Int(1, 12000);
    const embed = new MessageEmbed()

    if (random > 6001) { // 5999/12000 chance of heads
      result = 'Heads';
      image = 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/flip_heads.png?raw=true';
    }
    else if (random > 2) { // 5999/12000 chance of tails
      result = 'Tails';
      image = 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/flip_tails.png?raw=true';
    }
    else { // 1/6000 chance of edge
      result = 'What the...';
      image = 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/flip_edge.jpg?raw=true';
      embed
      .setURL('https://en.wikipedia.org/wiki/Coin_flipping')
      .setFooter('Fun fact: There\'s a 1/6000 chance of a coin landing on its edge!');
    }

    embed
    .setAuthor(result)
    .setImage(image)
    .setColor(default_embed_color);

    Reply_Successful_Command(embed, message);
    
    return embed;
  }
}
