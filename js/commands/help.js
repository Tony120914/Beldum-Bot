const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all Beldum Bot\'s commands'),

  async execute(interaction) {
    const commands = interaction.client.commands;

    // List help for all commands    
    const command_usages = commands.map(command => `\`/${command.data.name}\``).join(' ');

    embed = new MessageEmbed()
      .setAuthor('Commands')
      .setDescription(`${command_usages}`)
      .addField('Want to see documentation of all the commands?',
        '[Click here](https://tony120914.github.io/beldum-bot-site/#/commands)', true)
      .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/479Rotom-Pok%C3%A9dex.png?raw=true')
      .setColor(default_embed_color);

    await interaction.reply({ embeds: [embed]});

  }
}
