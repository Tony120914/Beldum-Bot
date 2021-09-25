const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverpopulation')
    .setDescription('Get the number of members in this server'),

  async execute(interaction) {
      const embed = new MessageEmbed()
        .setAuthor(`${interaction.guild.name}'s server population`)
        .setDescription(`Currently houses **${interaction.guild.memberCount}** members.`)
        .setColor(default_embed_color);

      await interaction.reply({ embeds: [embed]});
  }

}
