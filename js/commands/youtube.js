const { MessageEmbed } = require("discord.js");
const { default_embed_color, embed_field_value_limit } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('youtube')
    .setDescription('Perform a YouTube search')
    .addStringOption(option =>
      option.setName('keywords')
        .setDescription('search keywords')
        .setRequired(true)),

  async execute(interaction) {
    const arg1 = interaction.options.getString('keywords');
    const keywords = arg1.slice(0, embed_field_value_limit);

    // YouTube URL for searching
    const youtube_url = `https://www.youtube.com/results?search_query=${encodeURI(keywords)}`;

    const embed = new MessageEmbed()
      .setAuthor('YouTube Search', 'https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/youtube.png')
      .setDescription(`Click [here](${youtube_url}) for your search results.`)
      .addField('Keywords', keywords)
      .setColor(default_embed_color);

    await interaction.reply({ embeds: [embed]});
  }
}
