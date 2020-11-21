const { MessageEmbed, Message } = require("discord.js");
const { prefix, default_embed_color } = require('../../config.json');
const { Reply_Successful_Command, Reply_Usage_Error, Get_Random_Int } = require('../utilities.js');

module.exports = {
  name: 'rng',
  aliases: ['random', 'roll'],
  description: 'A random number generator that generates a random number between two values inclusively.',
  args: true,
  usage: '<number> <number>',
  examples: `${prefix}rng 1 100`,

  execute(message, arguments) {

    const num1 = parseInt(arguments[0]);
    const num2 = parseInt(arguments[1]);

    if (!isNaN(num1) && !isNaN(num2)) {
      const min = Math.min(num1, num2);
      const max = Math.max(num1, num2);
      const random = Get_Random_Int(min, max);

      const embed = new MessageEmbed()
      .addField(':game_die: Random Number Generator :game_die:', `A number between ${min} and ${max} (both inclusive).`)
      .addField('Result', random)
      .setColor(default_embed_color);

      Reply_Successful_Command(embed, message);

      return embed;
    }
    else {
      Reply_Usage_Error(message, this.name, this.usage, "(integer numbers only)");
    }

  }
}
