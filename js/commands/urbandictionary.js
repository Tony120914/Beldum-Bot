const { MessageEmbed } = require("discord.js");
const { default_embed_color, embed_field_value_limit } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('urbandictionary')
    .setDescription('Perform a Urban Dictionary search (it will return the top definition)')
    .addStringOption(option =>
      option.setName('keywords')
        .setDescription('search keywords')
        .setRequired(true)),

  async execute(interaction) {
    const arg1 = interaction.options.getString('keywords');
    const keywords = arg1.slice(0, embed_field_value_limit);

    // Urban Dictionary unofficial API
    const ud_url = `http://api.urbandictionary.com/v0/define?term=${encodeURI(keywords)}`;

    // GET request
    const response = await fetch(ud_url);
    const json = await response.json();

    // No results from ud
    if (!json.list || json.list.length == 0 || json.result_type == 'no_results') {
      await interaction.reply({ content: 'Urban Dictionary has no results for this set of keywords.' });
      return;
    };

    // Parse top definition
    const ud = json.list[0];
    ud.definition = padEmptyStrings(ud.definition).slice(0, embed_field_value_limit);
    ud.author = padEmptyStrings(ud.author).slice(0, embed_field_value_limit);
    ud.ud_author_url = padEmptyStrings(`https://www.urbandictionary.com/author.php?author=${encodeURI(ud.author)}`).slice(0, embed_field_value_limit);
    ud.word = padEmptyStrings(ud.word).slice(0, embed_field_value_limit);
    ud.date = padEmptyStrings(new Date(ud.written_on).toDateString()).slice(0, embed_field_value_limit);
    ud.example = padEmptyStrings(ud.example).slice(0, embed_field_value_limit);
    //ud.permalink = ud.permalink;
    //ud.thumbs_up = ud.thumbs_up;
    //ud.thumbs_down = ud.thumbs_down;

    const embed = new MessageEmbed()
      .setAuthor('Urban Dictionary')
      .addField('Term', `[${ud.word}](${ud.permalink})`)
      .addField('Top Definition', ud.definition)
      .addField('Example', ud.example)
      .addField(':thumbsup:', `${ud.thumbs_up}`, true)
      .addField(':thumbsdown:', `${ud.thumbs_down}`, true)
      .addField('By',`[${ud.author}](${ud.ud_author_url})`, true)
      .setFooter(`Date posted: ${ud.date}`)
      .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/urbandictionary.png?raw=true')
      .setColor(default_embed_color);

    await interaction.reply({ embeds: [embed] });
  }
}

// Helper for changing strings to 'N/A' if they are empty
function padEmptyStrings(string) {
  if (string.trim() == '') {
    return 'N/A'
  } else {
    return string;
  }
}