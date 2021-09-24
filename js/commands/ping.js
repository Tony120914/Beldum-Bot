const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check Beldum-Bot\'s ping'),
    
  async execute(interaction) {
    const ping = interaction.client.ws.ping;
    let status;
    
    if (ping < 100) status = ":rocket:";
    else if (ping < 200) status = ":person_shrugging:";
    else status = ":snail:";

    const embed = new MessageEmbed()
      .setAuthor(`${ping} ms`)
      .setDescription(status)
      .setColor(default_embed_color);

    await interaction.reply({ embeds: [embed] });
  }
}
