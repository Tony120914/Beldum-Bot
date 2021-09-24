const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('servericon')
    .setDescription('Get the current server icon image in the highest possible resolution'),

  async execute(interaction) {
    const icon = interaction.guild.iconURL({ format: "png", dynamic: true, size: 4096 });

    // Server icon must exist
    if (icon) {
      const embed = new MessageEmbed()
        .setDescription(`${interaction.guild.name}'s server icon`)
        .setImage(icon)
        .setColor(default_embed_color);

      await interaction.reply({ embeds: [embed]});
    }
    else {
      await interaction.reply({ content: 'Server icon does not exist', ephemeral: true});
    }
  }

}
