const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('See basic information and statistics about this bot'),

  async execute(interaction) {

    // Get stats throughout all shards
    const server_count = await interaction.client.shard.fetchClientValues('guilds.cache.size')
      .then(counts => { return counts.reduce((acc, count) => acc + count, 0) });
    const member_count = await interaction.client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
      .then(counts => { return counts.reduce((acc, count) => acc + count, 0) });
    
    const embed = new MessageEmbed()
      .setAuthor('Beldum-Bot', 'https://github.com/Tony120914/Beldum-Bot/blob/master/images/Bag_Ultra_Ball_Sprite.png?raw=true')
      .addField('Prefix (Slash commands)', `\`/\``, true)
      .addField('List of commands', '\`/help\`', true)
      .addField('Are you enjoying Beldum-bot?', 'Click [here](https://discord.com/api/oauth2/authorize?client_id=454764425090433034&permissions=19456&scope=bot%20applications.commands) to invite Beldum-Bot to another server.' + '\n' +
                                                'Click [here](https://top.gg/bot/454764425090433034/vote) to vote for Beldum-Bot daily.', false)
      .addField('Want to support/buy me a coffee?', `I have a [Ko-fi](https://ko-fi.com/toeknee).`, false)
      .addField('Websites', '[Website](https://tony120914.github.io/beldum-bot-site)' + '\n' +
                            '[Source code](https://github.com/Tony120914/Beldum-Bot)' + '\n' +
                            '[Top.gg](https://top.gg/bot/454764425090433034)', true)
      .addField('Found a bug? Report it!', 'Create a [GitHub issue](https://github.com/Tony120914/Beldum-Bot/issues)', true)
      .setFooter(`Currently in ${server_count} servers with ${member_count} users`)
      .setTimestamp()
      .setThumbnail(interaction.client.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }))
      .setColor(default_embed_color);

      await interaction.reply({ embeds: [embed] });
  }

}
