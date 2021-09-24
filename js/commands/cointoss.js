const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRandomInt } = require("../utilities.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cointoss')
    .setDescription('Toss a coin, heads or tails (Fun fact: there is a 1/6000 chance of a coin landing on its edge)'),

  async execute(interaction) {
    let result;
    let image;
    const random = getRandomInt(1, 12000);
    const embed = new MessageEmbed()

    if (random > 6001) { // 5999/12000 chance of heads
      result = 'Heads';
      image = 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/cointoss_heads.png?raw=true';
    }
    else if (random > 2) { // 5999/12000 chance of tails
      result = 'Tails';
      image = 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/cointoss_tails.png?raw=true';
    }
    else { // 1/6000 chance of edge
      result = 'What the...';
      image = 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/cointoss_edge.png?raw=true';
      embed.setFooter('Fun fact: There\'s a 1/6000 chance of a coin landing on its edge');
    }

    embed.setAuthor(result)
      .setImage(image)
      .setColor(default_embed_color);
    
    await interaction.reply({ embeds: [embed]});
  }
}
