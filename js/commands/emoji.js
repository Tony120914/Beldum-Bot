const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emoji')
    .setDescription('Get the custom emoji\'s image in this server in the highest possible resolution')
    .addStringOption(option =>
      option.setName('emoji')
        .setDescription('a custom emoji')
        .setRequired(true)),

  async execute(interaction) {
    const arg1 = interaction.options.getString('emoji');

    // Raw format of emoji should be '<:name:id>'
    const last_colon_index = arg1.lastIndexOf(':');
    const emoji_id = arg1.slice(last_colon_index + 1, -1);
    const emoji = interaction.client.emojis.cache.get(emoji_id);

    // Custom emojis only
    if (emoji && emoji.url) {
      const embed = new MessageEmbed()
        .setAuthor(`:${emoji.name}:`)
        .setImage(emoji.url)
        .setColor(default_embed_color);

      await interaction.reply({ embeds: [embed]});
    } else {
      await interaction.reply({ content: 'Custom emojis in this server only', ephemeral: true});
    }
  }
}
