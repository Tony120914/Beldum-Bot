const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { Reply_Successful_Command, Reply_Usage_Error } = require('../utilities.js');

module.exports = {
  name: 'avatar',
  aliases: ['pfp'],
  description: 'Get the avatar image of a tagged user.',
  args: true,
  usage: '<@user>',

  execute(message, arguments) {

    const mentions = message.mentions.users.array();

    // Only 1 mention
    if (mentions.length == 1) {
      
      const embed = new MessageEmbed()
      .setDescription(`${message.mentions.users.first()}'s avatar`)
      .setImage(message.mentions.users.first().displayAvatarURL({ format: "png", dynamic: true, size: 4096 }))
      .setColor(default_embed_color);

      Reply_Successful_Command(embed, message);

      return embed;
    }
    else {
      return Reply_Usage_Error(message, this.name, this.usage);
    }
  }

}
