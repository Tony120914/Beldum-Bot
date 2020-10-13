const { MessageEmbed } = require("discord.js");
const { creator_id, default_embed_color } = require('../../config.json');
const { Reply_Successful_Command, Fetch_Server_Counts } = require('../utilities.js');

module.exports = {
  name: 'info',
  aliases: ['information', 'about'],
  description: 'Basic information about this bot',
  args: false,
  usage: '',

  async execute(message, arguments) {

    // Get total server count throughout all shards
    const server_count = await Fetch_Server_Counts(message.client);

    const embed = new MessageEmbed()
    .setAuthor('Beldum-Bot', 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/Bag_Ultra_Ball_Sprite.png?raw=true')
    .setDescription('Holding an [Everstone](https://bulbapedia.bulbagarden.net/wiki/Everstone) in the [discord.js](https://discord.js.org/) library')
    .addField('Prefix', '\`//\`', true)
    .addField('List of commands', '\`//help\`', true)
    .addField('Are you enjoying Beldum-bot?', 'Click [here](https://discord.com/oauth2/authorize?client_id=454764425090433034&scope=bot&permissions=347200) to invite Beldum-Bot to another server!' + '\n' +
                                              'Click [here](https://top.gg/bot/454764425090433034/vote) to vote for Beldum-Bot daily!', false)
    .addField('Found a bug? Report it!', 'Create a [GitHub issue](https://github.com/Tony120914/Beldum-Bot/issues)!', false)
    .addField('Websites', '[GitHub](https://github.com/Tony120914/Beldum-Bot) (source code)' + '\n' +
                          '[Top.gg](https://top.gg/bot/454764425090433034)', true)
    .addField('Creator', `<@${creator_id}>`, true)
    .setFooter(`Currently in ${server_count} servers`)
    .setTimestamp()
    .setThumbnail(message.client.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }))
    .setColor(default_embed_color);

    Reply_Successful_Command(embed, message);
    
    return embed;
  }

}
