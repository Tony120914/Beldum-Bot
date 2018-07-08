
// Command for "//youtube keywords..."
module.exports = (message) => {
  let keywords = message.content.substring('//youtube '.length);

  // Youtube URL for searching
  let youtube_url = 'https://www.youtube.com/results?search_query=';
  youtube_url += keywords;

  // Replacing spaces with +
  youtube_url = youtube_url.replace(/ /g, '+');

  message.reply(youtube_url)
  .then(console.log('Successful YouTube search'))
  .catch(console.error);
}
