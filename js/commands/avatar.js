
// Command for "//avatar <name>"
module.exports = (message, prefix) => {

  // Array of @mentions in the message
  let array_of_mentions = message.mentions.users.array();

  // Only 1 mention and must have avatar
  if (array_of_mentions.length == 1 && message.mentions.users.first().avatar != null) {
    message.channel.send(message.mentions.users.first().avatarURL)
    .then(console.log("Successful avatar url"))
    .catch(console.error);
  }
  else {
    message.reply(`_Beldum Beldum_ :anger: \`(Use it like this: ${prefix}avatar @name, or avatar unavailable.)\``)
    .then(console.log("Successful error reply"))
    .catch(console.error);
  }

}
