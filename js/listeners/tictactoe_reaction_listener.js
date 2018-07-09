
// Reaction listener for Tic-tac-toe game
module.exports = (client, message, new_message, player1_id, player2_id, turn_id, symbol, symbols, grid_message) => {
  client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.id == new_message.id && turn_id == user.id) {

      let emoji;
      // Convert emoji identifier to :emoji: format
      switch(reaction.emoji.identifier) {
        case '1%E2%83%A3':
          emoji = ':one:'
          break;
        case '2%E2%83%A3':
          emoji = ':two:'
          break;
        case '3%E2%83%A3':
          emoji = ':three:'
          break;
        case '4%E2%83%A3':
          emoji = ':four:'
          break;
        case '5%E2%83%A3':
          emoji = ':five:'
          break;
        case '6%E2%83%A3':
          emoji = ':six:'
          break;
        case '7%E2%83%A3':
          emoji = ':seven:'
          break;
        case '8%E2%83%A3':
          emoji = ':eight:'
          break;
        case '9%E2%83%A3':
          emoji = ':nine:'
          break;
        default:
          break;
      }

      // Replace number tile with O or X (checks if it exists first)
      if (grid_message.content.indexOf(emoji) == -1) {
        return;
      }
      var new_grid_message;
      grid_message.edit(grid_message.content.replace(emoji, symbol))
      .then((new_message) => {
        grid_message = new_message;
        console.log("Successful number to symbol conversion");
      })
      .catch(console.error);

      // Replace player with the next and symbol with the next
      let player_switch;
      if (turn_id == player1_id) {
        player_switch = player1_id;
      }
      else {
        player_switch = player2_id;
      }
      let temp_message = new_message.content.replace('<@' + turn_id + '>', '<@' + player_switch + '>');
      temp_message = temp_message.replace(symbol, symbols[Math.abs(symbols.findIndex((sym) => {return sym == symbol}) - 1)])
      new_message.edit(temp_message)
      .then(console.log("Successful turn and symbol switch"))
      .catch(console.error);

      // Toggle symbols between O and X
      symbol = symbols[Math.abs(symbols.findIndex((sym) => {
        return sym == symbol;
      }) - 1)];
    }
  })
}
