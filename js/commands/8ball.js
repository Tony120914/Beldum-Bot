const { MessageEmbed } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { Get_Random_Int, Reply_Successful_Command } = require("../utilities.js");

module.exports = {
  name: '8ball',
  aliases: ['8-ball', 'eightball', 'eight-ball'],
  description: 'Ask the magic 8-ball a yes/no question.',
  args: true,
  usage: '<yes/no question>',
  
  execute(message, arguments) {

    const answers = [
      // Yes - answers
      ':white_check_mark: Oh yeah, 100%.',
      ':white_check_mark: Of course!',
      ':white_check_mark: Obviously...',
      ':white_check_mark: Science says yes.',

      // Maybe - answers
      ':grey_question: Maybe...',
      ':grey_question: My crystal ball is foggy...',

      // No - answers
      ':no_entry_sign: Hahaha. No.',
      ':no_entry_sign: In your dreams...',
      ':no_entry_sign: Nope. Nope. Nope. Nope. Nope.',
      ':no_entry_sign: Absolutely not.',
    ];
    
    const random = Get_Random_Int(0, answers.length - 1);

    const embed = new MessageEmbed()
    .addField('The Magic :8ball:-ball', answers[random], false)
    .setColor(default_embed_color);

    Reply_Successful_Command(embed, message);

    return embed;
  }

}