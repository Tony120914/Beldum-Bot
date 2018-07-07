
// Command for "//emoji :custom emoji:"
module.exports = (message) => {

  // Format should be '<:name:id>'
  let emoji_name = message.content.substring('//emoji '.length);
  // Now format should be 'name'
  emoji_name = emoji_name.substring(emoji_name.indexOf(':') + 1, emoji_name.lastIndexOf(':'));

  let emoji = message.guild.emojis.find('name', emoji_name);

  if (emoji == null) {
    message.reply('_Beldum Beldum_ :anger: \`(Incorrect format [use it like this: //emoji :custom emoji:], or custom emoji does not exist within this server)\`');
  }

  else {
    message.reply(emoji.url);
  }

}
