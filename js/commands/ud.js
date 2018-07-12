
// Command for "//ud [keywords...]"
module.exports = (Discord, request, message, prefix) => {
  let keywords = message.content.substring((prefix + 'ud').length).trim();

  // Google URL for searching
  let ud_url = 'http://api.urbandictionary.com/v0/';
  let ud_author_url = 'https://www.urbandictionary.com/author.php?author=';

  // No arguments -> random ud search
  if (keywords == '') {
    ud_url += 'random';
    keywords = '<something randomly generated>';
  }
  else {
    ud_url += 'define?term=';
    ud_url += keywords;
  }

  // Replacing spaces with +
  ud_url = ud_url.replace(/ /g, '+');

  request.get(ud_url, function (error, response, body) {
    if (error) {
      console.log('ud error:', error); // Print the error if one occurred
    }
    else {
      console.log('ud statusCode:', response && response.statusCode); // Print the response status code if a response was received

      let data = JSON.parse(body); // parse string -> object
      if (data.result_type == 'no_results'){
        message.reply('Urban Dictionary has no results for this set of keywords.')
        .then(console.log('Successful ud search (no results)'))
        .catch(console.error);
        return;
      };
      construct_ud_richembed(data);
    }
  });



  // Helper for constructing RichEmbed within request
  function construct_ud_richembed(data) {

    let min = 0;
    let max = data.list.length - 1;
    // Inclusive random integers from Math.random() MDN web docs
    let random = Math.floor(Math.random() * (max - min + 1)) + min;

    let ud_def = data.list[random];
    ud_author_url += ud_def.author.replace(/ /g, '+');

    const rich_embed = new Discord.RichEmbed()
    .setColor('DARK_GOLD')
    .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/ud.png?raw=true')
    .setAuthor('Urban Dictionary')
    .addField('Search result', `[${ud_def.word}](${ud_def.permalink})`, true)
    .addBlankField(false)
    .addField('Definition', ud_def.definition, true)
    .addField('Example', ud_def.example, true)
    .addBlankField(false)
    .addField(`:thumbsup::skin-tone-2: ${ud_def.thumbs_up} :thumbsdown::skin-tone-2: ${ud_def.thumbs_down}`, `By: [${ud_def.author}](${ud_author_url})`, true)
    .setFooter(`Posted ${ud_def.written_on}`)
    ;

    // Send RichEmbed
    message.channel.send(rich_embed)
    .then(console.log('Successful ud search'))
    .catch(console.error);
  }

}
