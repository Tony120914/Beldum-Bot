
// Command for "//8ball question"
module.exports = (Discord, message, prefix) => {

  const big_no = generate_big_no();
  const big_yes = generate_big_yes();

  const answers = [
    // Yes - answers
    'Oh yeah, 100%',
    'Very likely',
    'Science says yes',
    '_Beldum interrupts_ **AFFIRMATIVE.**',
    big_yes,
    // Maybe - answers
    'Maybe...',
    '_Beldum interrupts_ **INDETERMINATE**',
    // No - answers
    'Hahaha. No.',
    'Only in your wildest dreams',
    'Probably not',
    '_Beldum interrupts_ **NEGATIVE.**',
    big_no,
  ];

  if (message.content == (prefix + '8ball')) {
    message.reply(`_Beldum Beldum_ :anger: \`You didn't ask any questions!\``)
    .then(console.log("Successful error reply"))
    .catch(console.error);
    return;
  }

  let min = 0;
  let max = answers.length - 1;
  // Inclusive random integers from Math.random() MDN web docs
  let random = Math.floor(Math.random() * (max - min + 1)) + min;

  const rich_embed = new Discord.RichEmbed()
  .setColor('DARK_GOLD')
  .addField(':8ball: The Magic 8-ball', answers[random], false)
  ;

  message.channel.send(rich_embed)
  .then(console.log('Successful magic 8-ball answer'))
  .catch(console.error);


  // Helper functions for big yes and big no
  function generate_big_no() {
    let big_no = '';
    big_no += '|\\             |     \\_\\_\\_\\_\\_\\_\\_\n';
    big_no += '|   \\          |    |              |\n';
    big_no += '|      \\       |    |              |\n';
    big_no += '|         \\    |    |              |\n';
    big_no += '|            \\ |    |\\_\\_\\_\\_\\_\\_\\_|\n';

    // Algorithm method
    /*
    let big_no_width = 5;
    for (i = 0; i < big_no_width; i++) {
      // N
      big_no += '|' + ' '.repeat(i * 3) + '\\' + ' '.repeat((big_no_width * 3) - (i * 3) - 2) + '|\t';
      // O
      if (i == 0) big_no += ' ' + '\\_'.repeat(big_no_width * 1.5) + '\n'; // O's first horizontal line
      else if (i == big_no_width - 1) big_no += '|' + '\\_'.repeat(big_no_width * 1.5) + '|\n'; // O's last horizontal line
      else big_no += '|' + ' '.repeat(big_no_width * 2.5) + '  ' + '|\n'; // O's vertical lines
    }
    */

    return big_no;
  }

  function generate_big_yes() {
    let big_yes = '';
    big_yes += '\\            /    \\_\\_\\_\\_\\_\\_      \\_\\_\\_\\_\\_\\_\n';
    big_yes += '   \\      /      |            |    |\n';
    big_yes += '      \\\\/         |\\_\\_\\_\\_\\_\\_|    \\|\\_\\_\\_\\_\\_\\_\n';
    big_yes += '        |           |                              |\n';
    big_yes += '        |            |\\_\\_\\_\\_\\_\\_    \\_\\_\\_\\_\\_\\_|\n';

    return big_yes;
  }

}
