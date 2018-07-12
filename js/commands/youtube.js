
// Command for "//youtube keywords..."
module.exports = (Discord, message, prefix) => {
  let keywords = message.content.substring((prefix + 'youtube ').length).trim();

  // Didn't search for anything
  if (keywords == '') {
    message.reply(`_Beldum Beldum_ :anger: \`(Use it like this: ${prefix}youtube keywords...\``)
    .then(console.log("Successful error reply"))
    .catch(console.error);
    return;
  }

  // Youtube URL for searching
  let youtube_url = 'https://www.youtube.com/results?search_query=';
  youtube_url += keywords;

  // Replacing spaces with +
  youtube_url = youtube_url.replace(/ /g, '+');

  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .setThumbnail('https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/youtube.png')
  .setAuthor('Youtube')
  .addField('Searched for', keywords, true)
  .addField('Result', youtube_url, true)

  // Send RichEmbed
  message.channel.send(rich_embed)
  .then(console.log('Successful YouTube search'))
  .catch(console.error);
}
