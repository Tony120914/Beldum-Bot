const { MessageEmbed } = require("discord.js");
const { default_embed_color, embed_field_value_limit } = require('../../config.json');
const { Reply_Successful_Command, Reply_Usage_Error } = require('../utilities.js');

module.exports = {
  name: 'youtube',
  aliases: ['utube'],
  description: 'Performs a Youtube search using the specified keywords.',
  args: true,
  usage: '<keywords>',

  execute(message, arguments) {

    const keywords = arguments.join(' ');

    // Enforce character limit
    if (keywords.length > embed_field_value_limit) {
      return Reply_Usage_Error(message, this.name, this.usage, `(keywords have exceeded ${embed_field_value_limit} characters)`);
    }

    // YouTube URL for searching
    const youtube_url = `https://www.youtube.com/results?search_query=${encodeURI(keywords)}`;

    const embed = new MessageEmbed()
    .setThumbnail('https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/youtube.png')
    .setAuthor('YouTube Search', 'https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/youtube.png')
    .setDescription(`Click [here](${youtube_url}) for your search results.`)
    .addField('Keywords', keywords)
    .setColor(default_embed_color);

    Reply_Successful_Command(embed, message);

    return embed;
  }
}
