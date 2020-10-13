const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { Reply_Successful_Command, Reply_Usage_Error } = require('../utilities.js');

module.exports = {
  name: 'emoji',
  aliases: ['emote', 'emoticon'],
  description: 'Get the specified custom emoji\'s image.',
  args: true,
  usage: '<:emoji:>',

  execute(message, arguments) {

    // Raw format of emoji should be '<:name:id>'
    const last_colon_index = arguments[0].lastIndexOf(':');
    const emoji_id = arguments[0].slice(last_colon_index + 1, -1);
    const emoji = message.guild.emojis.cache.get(emoji_id);

    // Custom emojis only
    if (emoji && emoji.url) {
      const embed = new MessageEmbed()
      .setAuthor(`:${emoji.name}:`)
      .setImage(emoji.url)
      .setColor(default_embed_color);

      Reply_Successful_Command(embed, message);

      return embed;
    }

    else {
      return Reply_Usage_Error(message, this.name, this.usage, '(custom emojis in this server only)');
    }
  }
}
