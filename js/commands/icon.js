
// Command for "//icon"
module.exports = (Discord, message, prefix) => {

  let icon = message.guild.iconURL;

  if (icon != null) {

    icon = icon.replace('.jpg', '.png');

    const rich_embed = new Discord.RichEmbed()
    .setColor('DARK_GOLD')
    .setDescription(`${message.guild.name}'s server icon`)
    .setImage(icon)
    ;

    message.channel.send(rich_embed)
    .then(console.log(`Successful command reply to ${message.content}`))
    .catch(console.error);
    return rich_embed;
  }

  else {
    let log = `Successful error reply to ${message.content}`;
    message.reply(`_Beldum Beldum_ :anger: \`(Server icon unavailable.)\``)
    .then(console.log(log))
    .catch(console.error);
    return log;
  }

}
