
// Command for ""//rps"
module.exports = (message) => {

  // Rock, paper, scissors
  let rps = [':new_moon:', ':newspaper:', ':scissors:']

  let user_choice = message.content.substring('//rps '.length);

  // Validity check
  if (user_choice != 'r' && user_choice != 'p' && user_choice != 's') {
    message.reply('_Beldum Beldum_ :anger: \`(Use it like this: //rps r or p or s\`')
    .then(console.log("Successful error reply"))
    .catch(console.error);
    return;
  }

  // Convert r/p/s to emoji variant
  if (user_choice == 'r') {
    user_choice = rps[0];
  }
  else if (user_choice == 'p') {
    user_choice = rps[1];
  }
  else if (user_choice == 's') {
    user_choice = rps[2];
  }

  // Randomly choose rps for bot
  // Inclusive random integers from Math.random() MDN web docs
  let bot_choice = rps[Math.floor(Math.random() * (2 - 0 + 1)) + 0];

  // Case 1: user wins
  if (user_choice == rps[0] && bot_choice == rps[2] ||
      user_choice == rps[2] && bot_choice == rps[1] ||
      user_choice == rps[1] && bot_choice == rps[0]) {
        message.reply('_You used_ ' + user_choice + ' _and Beldum used_ ' + bot_choice + ' , _it\'s super effective!_')
        .then(console.log("Successful rps user win"))
        .catch(console.error);
  }

  // Case 2: bot wins
  else if (user_choice == rps[0] && bot_choice == rps[1] ||
      user_choice == rps[1] && bot_choice == rps[2] ||
      user_choice == rps[2] && bot_choice == rps[0]) {
        message.reply('_You used_ ' + user_choice + ' _and Beldum used_ ' + bot_choice + ' , _it\'s not very effective..._')
        .then(console.log("Successful rps bot win"))
        .catch(console.error);
  }

  // Case 3: tie
  else {
    message.reply('_You used_ ' + user_choice + ' _and Beldum used_ ' + bot_choice + ' , _but nothing happened..._')
    .then(console.log("Successful rps tie"))
    .catch(console.error);
  }

}
