
// Command for "//server icon"
module.exports = (Discord, message) => {

  let icon = message.guild.iconURL;

  if (icon != null) {

    const rich_embed = new Discord.RichEmbed()
    .setColor('DARK_GOLD')
    .setImage(icon)
    ;

    message.channel.send(rich_embed)
    .then(console.log("Successful icon url"))
    .catch(console.error);
  }

}
