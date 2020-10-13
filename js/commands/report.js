const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { Reply_Successful_Command } = require('../utilities.js');

module.exports = {
  name: 'report',
  aliases: ['bug', 'issue'],
  description: 'Found a bug? Get instructions on how to report a bug',
  args: false,
  usage: '',

  execute(message, arguments) {

    const embed = new MessageEmbed()
    .addField('You found a :bug: and you want to report it?', 'Create a [GitHub issue](https://github.com/Tony120914/Beldum-Bot/issues)!')
    .addField('Thank you!', 'Beldum-Bot will be sure to level :up:')
    .setColor(default_embed_color);

    Reply_Successful_Command(embed, message);
    
    return embed;
  }
}
