
// Helper for checking permissions
module.exports = (client, message) => {

  const required_permissions = new Map([
    ['VIEW_CHANNEL', ' Read Text Channels & See Voice Channels'],
    ['SEND_MESSAGES', ' Send Messages'],
    ['EMBED_LINKS', ' Embed Links'],
    ['READ_MESSAGE_HISTORY', ' Read Message History'],
    ['USE_EXTERNAL_EMOJIS', ' Use External Emojis'],
    ['ADD_REACTIONS', ' Add Reactions'],
  ]);

  let missing_permissions = message.guild.members.get(client.user.id).missingPermissions(Array.from(required_permissions.keys()));

  for (let i = 0; i < missing_permissions.length; i++) {
    missing_permissions[i] = required_permissions.get(missing_permissions[i]);
  }

  if (missing_permissions.length != 0) {
      message.reply('_Beldum Beldum_ :warning:\n\n' +
                    '\`Beldum-Bot may at one point need the following permission(s) to function properly.\`\n\n' +
                    missing_permissions + '\n\n' +
                    '\`Please update Beldum-Bot\'s role in (Server Settings -> Roles), ' +
                    'or reinvite the bot using the updated invite link found here:\`\n\n https://discordapp.com/api/oauth2/authorize?client_id=454764425090433034&permissions=347200&scope=bot')
      .then(console.log("Successful missing permissions reply"))
      .catch(console.error);
      return false;
  }
  return true;
}
