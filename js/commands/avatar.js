
// Command for "//avatar <name>"
module.exports = (Discord, message, prefix) => {

  // Array of @mentions in the message
  let array_of_mentions = message.mentions.users.array();

  // Only 1 mention and must have avatar
  if (array_of_mentions.length == 1 && message.mentions.users.first().avatar != null) {

    const rich_embed = new Discord.RichEmbed()
    .setColor('DARK_GOLD')
    .setImage(message.mentions.users.first().avatarURL)
    ;

    message.channel.send(rich_embed)
    .then(console.log("Successful avatar url"))
    .catch(console.error);
  }
  else {
    message.reply(`_Beldum Beldum_ :anger: \`(Use it like this: ${prefix}avatar @user, or avatar unavailable.)\``)
    .then(console.log("Successful error reply"))
    .catch(console.error);
  }

}
