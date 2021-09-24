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
      .setDescription(`Type out any specific command to see details and usage\n${command_usages}`)
      .addField('Want to see the commands on a web interface?',
        'Click [here](https://github.com/Tony120914/Beldum-Bot/blob/master/README.md)', true)
      .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/479Rotom-Pok%C3%A9dex.png?raw=true')
      .setColor(default_embed_color);

    await interaction.reply({ embeds: [embed]});

  }
}
