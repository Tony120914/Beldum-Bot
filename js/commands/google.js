
// Command for "//google keywords..."
module.exports = (Discord, message, prefix) => {
  let keywords = message.content.substring((prefix + 'google ').length).trim();

  // Didn't search for anything
  if (keywords == '') {
    let log = `Successful error reply to ${message.content}`;
    message.reply(`_Beldum Beldum_ :anger: \`(Use it like this: ${prefix}google keywords...\``)
    .then(console.log(log))
    .catch(console.error);
    return log;
  }

  // Google URL for searching
  let google_url = 'https://www.google.com/search?q=';
  google_url += keywords;

  // Replacing spaces with +
  google_url = google_url.replace(/ /g, '+');

  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/google.png?raw=true')
  .setAuthor('Google')
  .addField('Searched for', keywords.substring(0, 1024), true)
  .addField('Result', google_url.substring(0, 1024), true)

  // Send RichEmbed
  message.channel.send(rich_embed)
  .then(console.log(`Successful command reply to ${message.content}`))
  .catch(console.error);
  return rich_embed;
}
