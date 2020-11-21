const { MessageEmbed } = require("discord.js");
const { prefix, default_embed_color } = require('../../config.json');
const { Reply_Successful_Command } = require('../utilities.js');

module.exports = {
  name: 'ping',
  aliases: ['pong'],
  description: 'Check Beldum-Bot\'s ping to see how it\'s doing.',
  args: false,
  usage: '',
  examples: `${prefix}ping`,

  execute(message, arguments) {

    const ping = message.client.ws.ping;
    let status;
    
    if (ping < 100) status = ":rocket: I've never been better!";
    else if (ping < 200) status = ":person_shrugging: Feeling okay I guess.";
    else status = ":snail: Okay, who used string shot on me...";

    const embed = new MessageEmbed()
    .setAuthor(`${ping} ms`)
    .setDescription(status)
    .setColor(default_embed_color);

    Reply_Successful_Command(embed, message);
      
    return embed;
  }
}
