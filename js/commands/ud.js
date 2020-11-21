const { MessageEmbed } = require("discord.js");
const { prefix, default_embed_color, embed_field_value_limit } = require('../../config.json');
const { Reply_Successful_Command, Reply_Usage_Error } = require('../utilities.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'ud',
  aliases: ['udsearch', 'urbandictionary'],
  description: 'Performs a Urban Dictionary search using the specified keywords (it will return the top definition).',
  args: true,
  usage: '<keywords>',
  examples: `${prefix}ud tfti`,

  execute(message, arguments) {

    const keywords = arguments.join(' ');

    // Enforce character limit
    if (keywords.length > embed_field_value_limit) {
      return Reply_Usage_Error(message, this.name, this.usage, `(keywords have exceeded ${embed_field_value_limit} characters)`);
    }

    // Urban Dictionary unofficial API
    const ud_url = `http://api.urbandictionary.com/v0/define?term=${encodeURI(keywords)}`;

    // GET request
    fetch(ud_url)
    .then(res => res.json())
    .then(json => {

      // No results from ud
      if (!json.list || json.list.length == 0 || json.result_type == 'no_results') {
        return Reply_Usage_Error(message, this.name, this.usage, `(Urban Dictionary has no results for this set of keywords)`);
      };

      // Top definition
      const ud = json.list[0];
      ud.definition = Empty_String_To_NA(ud.definition).slice(0, embed_field_value_limit);
      ud.author = Empty_String_To_NA(ud.author).slice(0, embed_field_value_limit);
      const ud_author_url = `https://www.urbandictionary.com/author.php?author=${encodeURI(ud.author)}`;
      ud.word = Empty_String_To_NA(ud.word).slice(0, embed_field_value_limit);
      const date = new Date(ud.written_on).toDateString();
      ud.example = Empty_String_To_NA(ud.example).slice(0, embed_field_value_limit);
      //ud.permalink = ud.permalink;
      //ud.thumbs_up = ud.thumbs_up;
      //ud.thumbs_down = ud.thumbs_down;

      const embed = new MessageEmbed()
      .setAuthor('Urban Dictionary')
      .addField('Term', `[${ud.word}](${ud.permalink})`)
      .addField('Top Definition', ud.definition)
      .addField('Example', ud.example)
      .addField('\u200b', '\u200b') // blank field
      .addField('By',`[${ud.author}](${ud_author_url})`, true)
      .addField(':thumbsup:', ud.thumbs_up, true)
      .addField(':thumbsdown:', ud.thumbs_down, true)
      .setFooter(`Date posted: ${date}`)
      .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/ud.png?raw=true')
      .setColor(default_embed_color);

      Reply_Successful_Command(embed, message);
      
      return embed;
    })
    .catch(console.error);

    // Helper for changing empty strings to 'N/A'
    function Empty_String_To_NA(string) {
      if (string.trim() == '') {
        return 'N/A'
      }
      else {
        return string;
      }
    }
    
  }
}
