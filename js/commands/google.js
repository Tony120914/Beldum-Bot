const { MessageEmbed } = require("discord.js");
const { default_embed_color, embed_field_value_limit } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('google')
    .setDescription('Perform a Google search')
    .addStringOption(option =>
      option.setName('keywords')
        .setDescription('search keywords')
        .setRequired(true)),

  async execute(interaction) {
    const arg1 = interaction.options.getString('keywords');
    const keywords = arg1.slice(0, embed_field_value_limit);

    // Google URL for searching
    const google_url = `https://www.google.com/search?q=${encodeURI(keywords)}`;

    const embed = new MessageEmbed()
      .setAuthor('Google Search', 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/google.png?raw=true')
      .setDescription(`Click [here](${google_url}) for your search results.`)
      .addField('Keywords', keywords)
      .setColor(default_embed_color);

    await interaction.reply({ embeds: [embed]});
  }
}
