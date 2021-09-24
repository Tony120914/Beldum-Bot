
module.exports = {
  // Inclusive random integers
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  getRandomInt: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

// Template for embeded
/*
const embed = new MessageEmbed()
  .setAuthor('Author', iconUrl='https://i.imgur.com/wSTFkRM.png', 'https://google.ca/#author')
  .setTitle("Title") // I don't like how it's a different font size
  .setURL('https://google.ca/#url')
  .setDescription('Description')
  .addField('Field Header', 'Field description')
  .addField('Field Header', 'Field description')
  .addField('\u200b', '\u200b') // blank field
  .addField('Field Header', 'Field description (inline)', inline=true)
  .addField('Field Header', 'Field description (inline)', inline=true)
  .setImage('https://i.imgur.com/wSTFkRM.png')
  .setFooter("Footer", iconUrl='https://i.imgur.com/wSTFkRM.png')
  .setTimestamp()
  .setThumbnail('https://i.imgur.com/wSTFkRM.png')
  .setColor('DARK_GOLD');
*/
