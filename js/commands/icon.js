const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { Reply_Successful_Command, Reply_Usage_Error } = require('../utilities.js');

module.exports = {
  name: 'icon',
  aliases: ['servericon', 'serverpicture', 'serverpfp'],
  description: 'Get the server icon image.',
  args: false,
  usage: '',

  execute(message, arguments) {

    const icon = message.guild.iconURL({ format: "png", dynamic: true, size: 4096 });

    // Server icon must exist
    if (icon) {

      const embed = new MessageEmbed()
      .setDescription(`${message.guild.name}'s server icon`)
      .setImage(icon)
      .setColor(default_embed_color);

      Reply_Successful_Command(embed, message);
      
      return embed;
    }
    else {
      return Reply_Usage_Error(message, this.name, this.usage, '(server icon does not exist)');
    }
  }

}
