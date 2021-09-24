const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reportbug')
    .setDescription('Found a bug? Get instructions on how to report a bug.'),

  async execute(interaction) {
    const embed = new MessageEmbed()
      .addField('You found a :bug: and you want to report it?', 'Please create a [GitHub issue](https://github.com/Tony120914/Beldum-Bot/issues).')
      .addField('Thank you!', 'I will try to fix it as soon as I have time.')
      .setColor(default_embed_color);

    await interaction.reply({ embeds: [embed]});
  }
}
