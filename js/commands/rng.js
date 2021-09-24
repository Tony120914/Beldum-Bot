const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRandomInt: getRandomInt } = require('../utilities');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rng')
    .setDescription('Random number generator that rolls a random number between two values inclusively')
    .addIntegerOption(option =>
      option.setName('num1')
        .setDescription('first number')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('num2')
        .setDescription('second number')
        .setRequired(true)),

  async execute(interaction) {
    const arg1 = interaction.options.getInteger('num1');
    const arg2 = interaction.options.getInteger('num2');

    const min = Math.min(arg1, arg2);
    const max = Math.max(arg1, arg2);
    const random = getRandomInt(min, max);

    const embed = new MessageEmbed()
      .addField(':game_die: Random Number Generator :game_die:', `A number between ${min} and ${max} (both inclusive).`)
      .addField('Result', `${random}`)
      .setColor(default_embed_color);

    await interaction.reply({ embeds: [embed]});

  }
}
