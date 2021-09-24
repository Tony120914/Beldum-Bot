const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get the profile picture of the tagged user in the highest possible resolution')
    .addMentionableOption(option =>
      option.setName('user')
        .setDescription('a user')
        .setRequired(true)),

  async execute(interaction) {
    const arg1 = interaction.options.getMentionable('user');

    const embed = new MessageEmbed()
      .setDescription(`${arg1.user}'s avatar`)
      .setImage(arg1.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }))
      .setColor(default_embed_color);

    await interaction.reply({ embeds: [embed] });
  }
}
