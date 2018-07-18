
// Command for "//report"
module.exports = (Discord, message, prefix, creator_id) => {

  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .addField('You found a :bug: and you want to report it?', 'Join my [support server](https://discord.gg/V4w4Bxu) and report it there! Or create a [GitHub issue](https://github.com/Tony120914/Beldum-Bot/issues)!' + '\n\n' +
            'Thank you so much! Beldum-Bot will be sure to level :up:', true)

  // Send RichEmbed
  message.channel.send(rich_embed)
  .then(console.log('Successful show how to report bugs'))
  .catch(console.error);
}
