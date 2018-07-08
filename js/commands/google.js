
// Command for "//google keywords..."
module.exports = (message) => {
  let keywords = message.content.substring('//google '.length);

  // Google URL for searching
  let google_url = 'https://www.google.com/search?q=';
  google_url += keywords;

  // Replacing spaces with +
  google_url = google_url.replace(/ /g, '+');

  message.reply(google_url)
  .then(console.log('Successful Google search'))
  .catch(console.error);
}
