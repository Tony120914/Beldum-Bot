
// Command for "//emoji :custom emoji:"
module.exports = (Discord, message, prefix) => {

  // Format should be '<:name:id>'
  let emoji_name = message.content.substring((prefix + 'emoji ').length);
  // Now format should be 'name'
  emoji_name = emoji_name.substring(emoji_name.indexOf(':') + 1, emoji_name.lastIndexOf(':'));

  let emoji = message.client.emojis.find('name', emoji_name);

  if (emoji == null || emoji.url == null) {
    message.reply(`_Beldum Beldum_ :anger: \`(Use it like this: ${prefix}emoji :emoji:, or it is not a custom emoji, or it is unavailable.)\``)
    .then(console.log("Successful error reply"))
    .catch(console.error);
  }

  else {
    const rich_embed = new Discord.RichEmbed()
    .setColor('DARK_GOLD')
    .setImage(emoji.url)
    ;

    message.channel.send(rich_embed)
    .then(console.log("Successful emoji"))
    .catch(console.error);
  }

}
