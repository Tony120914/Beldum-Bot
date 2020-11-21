const { MessageEmbed } = require("discord.js");
const { prefix, default_embed_color, embed_field_value_limit } = require('../../config.json');
const { Reply_Successful_Command, Reply_Usage_Error } = require('../utilities.js');

module.exports = {
  name: 'google',
  aliases: ['search'],
  description: 'Performs a Google search with the specified keywords.',
  args: true,
  usage: '<keywords>',
  examples: `${prefix}google how to internet`,

  execute(message, arguments) {

    const keywords = arguments.join(' ');

    // Enforce character limit
    if (keywords.length > embed_field_value_limit) {
      return Reply_Usage_Error(message, this.name, this.usage, `(keywords have exceeded ${embed_field_value_limit} characters)`);
    }

    // Google URL for searching
    const google_url = `https://www.google.com/search?q=${encodeURI(keywords)}`;

    const embed = new MessageEmbed()
    .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/google.png?raw=true')
    .setAuthor('Google Search', 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/google.png?raw=true')
    .setDescription(`Click [here](${google_url}) for your search results.`)
    .addField('Keywords', keywords)
    .setColor(default_embed_color);

    Reply_Successful_Command(embed, message);

    return embed;
  }
}
