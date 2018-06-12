
// Command for "//avatar <name>"
module.exports = (message) => {

  message.reply(message.mentions.users.first().avatarURL);

}
