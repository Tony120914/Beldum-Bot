
// Command for "//info"
module.exports = async (Discord, client, message, prefix, creator_id) => {

  // Get total server count throughout all shards
  let Fetch_Server_Counts = require('../helpers/utils.js').Fetch_Server_Counts;
  const server_count = await Fetch_Server_Counts(client);

  // RichEmbed
  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .setThumbnail('https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/374Beldum-Shiny.png')
  .setAuthor('Beldum-Bot', 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/Bag_Ultra_Ball_Sprite.png?raw=true')
  .setDescription('Holding an [Everstone](https://bulbapedia.bulbagarden.net/wiki/Everstone)... in the [discord.js](https://discord.js.org/) library')
  // .addBlankField(false)
  .addField('Prefix?', '\`//\`', true)
  .addField('List of commands?', '\`//help\`', true)
  .addBlankField(false)
  .addField('Are you enjoying Beldum-bot?', 'Click [here](https://discordapp.com/api/oauth2/authorize?client_id=454764425090433034&permissions=347200&scope=bot) to invite Beldum-Bot to another server!' + '\n' +
                                            'Click [here](https://discordbots.org/bot/454764425090433034/vote) to vote for Beldum-Bot daily!', false)
  .addBlankField(false)
  .addField('Want to report a bug?', 'Create a [GitHub issue](https://github.com/Tony120914/Beldum-Bot/issues)!', false)
  .addBlankField(false)
  .addField('Websites', '[GitHub](https://github.com/Tony120914/Beldum-Bot) (source code)' + '\n' +
                        '[Discord Bot List](https://discordbots.org/bot/454764425090433034)' + '\n' +
                        '[Discord Bots](https://bots.discord.pw/bots/454764425090433034)', true)
  .addField('Creator', `<@${creator_id}>`, true)
  .setFooter(`Currently in ${server_count} servers`)
  .setTimestamp();
  ;

  message.channel.send(rich_embed)
  .then(console.log(`Successful command reply to ${message.content}`))
  .catch(console.error);
  return rich_embed;
}
