
// Command for "//avatar <name>"
module.exports = (message) => {

  // Array of @mentions in the message
  let array_of_mentions = message.mentions.users.array();

  if (array_of_mentions.length == 1) {
    message.reply(message.mentions.users.first().avatarURL);
  }
  else {
    message.reply('_Beldum Beldum_ :anger: \`(Use it like this: //avatar @name)\`');
  }

}
