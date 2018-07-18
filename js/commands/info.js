
// Command for "//info"
module.exports = (Discord, client, message, prefix, creator_id) => {

  // RichEmbed
  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .setThumbnail('https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/374Beldum-Shiny.png')
  .setAuthor('Beldum-Bot', 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/Bag_Ultra_Ball_Sprite.png?raw=true')
  .setDescription('Holding an [Everstone](https://bulbapedia.bulbagarden.net/wiki/Everstone)...')
  .addField('Prefix?', '\`//\`', true)
  .addField('List of commands?', '\`//help\`', true)
  .addBlankField(false)
  .addField('What\'s a beldum?', 'It\'s a [Pokemon](https://bulbapedia.bulbagarden.net/wiki/Beldum_%28Pok%C3%A9mon%29)!', true)
  .addField('But why?...', 'Don\'t judge me, I\'m a nerd :nerd:', true)
  .addBlankField(false)
  .addField('Are you enjoying Beldum-bot?', 'Click [here](https://discordapp.com/api/oauth2/authorize?client_id=454764425090433034&permissions=347200&scope=bot) to invite Beldum-Bot to another server!' + '\n' +
                                            'Click [here](https://discordbots.org/bot/454764425090433034/vote) to vote for Beldum-Bot daily!', false)
  .addBlankField(false)
  .addField('Want to report a bug?', `Join the [Discord API server](https://discord.gg/discord-api) and private message <@${creator_id}>` + '\n' +
            'or create a GitHub issue [here](https://github.com/Tony120914/Beldum-Bot/issues).', false)
  .addField('Creator', `<@${creator_id}>`, true)
  .addField('Source code', '[GitHub](https://github.com/Tony120914/Beldum-Bot)', true)
  .setFooter(`Currently in ${client.guilds.size} servers`)
  .setTimestamp();
  ;

  message.channel.send(rich_embed)
  .then(console.log('Successful info reply'))
  .catch(console.error);

}
