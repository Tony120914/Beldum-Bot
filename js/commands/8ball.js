const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRandomInt } = require("../utilities.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask Beldum\'s eyeball a yes/no question')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('a yes/no question')
        .setRequired(true)),
  
  async execute(interaction) {
    const answers = [
      // Yes - answers
      ':white_check_mark: Oh yeah, 100%.',
      ':white_check_mark: Of course!',
      ':white_check_mark: Obviously...',
      ':white_check_mark: Science says yes.',

      // Maybe - answers
      ':grey_question: ¯\\_(ツ)_/¯',
      ':grey_question: My crystal ball is foggy...',

      // No - answers
      ':no_entry_sign: Hahaha. No.',
      ':no_entry_sign: In your dreams...',
      ':no_entry_sign: Nope. Nope. Nope. Nope. Nope.',
      ':no_entry_sign: Absolutely not.',
    ];
    
    const random = getRandomInt(0, answers.length - 1);

    const embed = new MessageEmbed()
      .addField('The Magic :8ball:-ball', answers[random], false)
      .setColor(default_embed_color);
    
    await interaction.reply({ embeds: [embed] });
  }

}