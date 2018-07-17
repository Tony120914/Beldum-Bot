
// Command for "//icon"
module.exports = (Discord, message, prefix) => {

  let icon = message.guild.iconURL;

  if (icon != null) {

    icon = icon.replace('.jpg', '.png');

    const rich_embed = new Discord.RichEmbed()
    .setColor('DARK_GOLD')
    .setImage(icon)
    ;

    message.channel.send(rich_embed)
    .then(console.log("Successful icon"))
    .catch(console.error);
  }

  else {
    message.reply(`_Beldum Beldum_ :anger: \`(Server icon unavailable.)\``)
    .then(console.log("Successful error reply"))
    .catch(console.error);
  }

}
