
// Command for "//google keywords..."
module.exports = (Discord, message, prefix) => {
  let keywords = message.content.substring((prefix + 'google ').length).trim();

  // Didn't search for anything
  if (keywords == '') {
    message.reply(`_Beldum Beldum_ :anger: \`(Use it like this: ${prefix}google keywords...\``)
    .then(console.log("Successful error reply"))
    .catch(console.error);
    return;
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
  .addField('Searched for', keywords, true)
  .addField('Result', google_url, true)

  // Send RichEmbed
  message.channel.send(rich_embed)
  .then(console.log('Successful Google search'))
  .catch(console.error);
}
