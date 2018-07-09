
// Command for ""//tictactoe @player1 @player2"
module.exports = (message, client) => {

  // Array of @mentions in the message
  let array_of_mentions = message.mentions.users.array();
  let symbols = [':o:', ':heavy_multiplication_x:'] // [O, X]
  var grid_message;

  if (array_of_mentions.length == 1 || array_of_mentions.length == 2) {

    // Randomly choose which player goes first
    // Inclusive random integers from Math.random() MDN web docs
    let random1 = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    let random2 = Math.abs(random1 - 1); // ensures it being 0 or 1

    // If only one player
    if (array_of_mentions.length == 1) {
      random1 = 0;
      random2 = 0;
    }

    // Randomly selects who goes first
    let player1_id = array_of_mentions[random1].id;
    let player2_id = array_of_mentions[random2].id;
    var turn_id = player1_id;
    var symbol = symbols[0];

    // Initial message, calls the user a loser if they're playing the game alone
    let initial_message = 'Tic-tac-toe game between <@' + player1_id + '> and ' + '<@' + player2_id + '> !';
    if (player1_id == player2_id) {
      initial_message += ' _(What a loser, playing this game with themself :joy:)_'
    }

    // Send initial message
    message.channel.send(initial_message)
    .then(console.log("Successful tictactoe message initialization"))
    .catch(console.error);

    // Send Tic-tac-toe grid
    message.channel.send(':one::two::three:' + '\n' +
                         ':four::five::six:' + '\n' +
                         ':seven::eight::nine:')
    .then((new_message) => {
      grid_message = new_message;
    })
    .then(console.log("Successful tictactoe game initialization"))
    .catch(console.error);

    // Send turn and reaction init
    message.channel.send('It\'s <@' + turn_id + '>\'s turn! Your symbol is ' + symbol)
    .then(async (new_message) => { // Async so it reacts in order
      await new_message.react('1⃣');
      await new_message.react('2⃣');
      await new_message.react('3⃣');
      await new_message.react('4⃣');
      await new_message.react('5⃣');
      await new_message.react('6⃣');
      await new_message.react('7⃣');
      await new_message.react('8⃣');
      await new_message.react('9⃣');

      // Tic-tac-toe game begins using the react listener
      require('../listeners/tictactoe_reaction_listener.js')(client, message, new_message, player1_id, player2_id, turn_id, symbol, symbols, grid_message);
    })
    .then(console.log("Successful tictactoe turn and react initialization"))
    .catch(console.error);

  }
  else {
    message.reply('_Beldum Beldum_ :anger: \`(Use it like this: //tictactoe @player1 @player2)\`')
    .then(console.log("Successful error reply"))
    .catch(console.error);
  }

}
