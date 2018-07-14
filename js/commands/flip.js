
// Command for "//flip"
module.exports = (Discord, message, prefix) => {

  // [Heads, Tails, Edge]
  const result_images = [
    'https://github.com/Tony120914/Beldum-Bot/blob/master/images/heads.png?raw=true',
    'https://github.com/Tony120914/Beldum-Bot/blob/master/images/tails.png?raw=true',
    'https://github.com/Tony120914/Beldum-Bot/blob/master/images/edge.jpg?raw=true'
  ];

  let min = 1;
  let max = 6000;
  // Inclusive random integers from Math.random() MDN web docs
  let random = Math.floor(Math.random() * (max - min + 1)) + min;

  let result;
  let image;
  if (random > 3000) {
    result = 'Heads';
    image = result_images[0];
  }
  else if (random > 1) {
    result = 'Tails';
    image = result_images[1];
  }
  else {
    result = 'What the...';
    image = result_images[2];
  }

  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .setAuthor(result)
  .setImage(image)
  ;

  message.channel.send(rich_embed)
  .then(console.log('Successful coin flip'))
  .catch(console.error);

}
