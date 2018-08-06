
// Command for "//emoji :custom emoji:"
module.exports = (Discord, message, prefix) => {

  // Format should be '<:name:id>'
  let emoji_name = message.content.substring((prefix + 'emoji ').length);
  // Now format should be 'name'
  emoji_name = emoji_name.substring(emoji_name.indexOf(':') + 1, emoji_name.lastIndexOf(':'));

  let emoji = message.guild.emojis.find('name', emoji_name);

  if (emoji == null || emoji.url == null) {
    let log = `Successful error reply to ${message.content}`;
    message.reply(`_Beldum Beldum_ :anger: \`(Use it like this: ${prefix}emoji :emoji:, or it is not a custom emoji, or it is unavailable to this server.)\``)
    .then(console.log(log))
    .catch(console.error);
    return log;
  }

  else {
    const rich_embed = new Discord.RichEmbed()
    .setColor('DARK_GOLD')
    .setDescription(`:${emoji_name}:`)
    .setImage(emoji.url)
    ;

    message.channel.send(rich_embed)
    .then(console.log(`Successful command reply to ${message.content}`))
    .catch(console.error);
    return rich_embed;
  }

}
