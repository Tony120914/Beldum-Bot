
// Command for "//flip"
module.exports = (Discord, message, prefix) => {

  // [Heads, Tails, Edge]
  const result_images = [
    'https://github.com/Tony120914/Beldum-Bot/blob/master/images/heads.png?raw=true',
    'https://github.com/Tony120914/Beldum-Bot/blob/master/images/tails.png?raw=true',
    'https://github.com/Tony120914/Beldum-Bot/blob/master/images/edge.jpg?raw=true'
  ];

  let min = 1;
  let max = 12000;
  // Inclusive random integers from Math.random() MDN web docs
  let random = Math.floor(Math.random() * (max - min + 1)) + min;

  let result;
  let image;
  if (random > 6001) {
    result = 'Heads'; // 5999/12000 chance of heads
    image = result_images[0];
  }
  else if (random > 2) {
    result = 'Tails'; // 5999/12000 chance of tails
    image = result_images[1];
  }
  else {
    result = 'What the...'; // 1/6000 chance of edge
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
