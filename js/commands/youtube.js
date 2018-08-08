
// Command for "//youtube keywords..."
module.exports = (Discord, message, prefix) => {
  let keywords = message.content.substring((prefix + 'youtube ').length).trim();

  // Didn't search for anything
  if (keywords == '') {
    let log = `Successful error reply to ${message.content}`;
    message.reply(`_Beldum Beldum_ :anger: \`(Use it like this: ${prefix}youtube keywords...\``)
    .then(console.log(log))
    .catch(console.error);
    return log;
  }

  // YouTube URL for searching
  let youtube_url = 'https://www.youtube.com/results?search_query=';
  youtube_url += keywords;

  // Replacing spaces with +
  youtube_url = youtube_url.replace(/ /g, '+');

  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .setThumbnail('https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/youtube.png')
  .setAuthor('YouTube')
  .addField('Searched for', keywords.substring(0, 1024), true)
  .addField('Result', youtube_url.substring(0, 1024), true)

  // Send RichEmbed
  message.channel.send(rich_embed)
  .then(console.log(`Successful command reply to ${message.content}`))
  .catch(console.error);
  return rich_embed;
}
