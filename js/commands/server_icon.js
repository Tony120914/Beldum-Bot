
// Command for "//server icon"
module.exports = (message) => {

  let icon = message.guild.iconURL;

  if (icon != null) {
    message.channel.send(icon)
    .then(console.log("Successful icon url"))
    .catch(console.error);
  }

}
