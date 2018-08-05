
// Command for "//avatar <name>"
module.exports = (Discord, message, prefix) => {

  // Array of @mentions in the message
  let array_of_mentions = message.mentions.users.array();

  // Only 1 mention and must have avatar
  if (array_of_mentions.length == 1 && message.mentions.users.first().avatar != null) {

    const rich_embed = new Discord.RichEmbed()
    .setColor('DARK_GOLD')
    .setDescription(`${message.mentions.users.first()}'s avatar`)
    .setImage(message.mentions.users.first().avatarURL)
    ;

    message.channel.send(rich_embed)
    .then(console.log(`Successful command reply to ${message.content}`))
    .catch(console.error);
    return rich_embed;
  }
  else {
    let log = `Successful error reply to ${message.content}`;
    message.reply(`_Beldum Beldum_ :anger: \`(Use it like this: ${prefix}avatar @user, or avatar unavailable.)\``)
    .then(console.log(log))
    .catch(console.error);
    return log;
  }

}
