const { MessageEmbed, Message } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { Reply_Successful_Command, Reply_Usage_Error, Get_Random_Int } = require('../utilities.js');

module.exports = {
  name: 'tictactoe',
  aliases: ['ttt', 'tic-tac-toe'],
  description: 'Play tictactoe with another user using reactions! (Please wait for the :ok: reaction before beginning.)',
  args: true,
  usage: '<@player1 @player2',

  async execute(message, arguments) {

    const mentions = message.mentions.users.array();

    if (mentions.length == 1 || mentions.length == 2) {

      const X = ':x:';
      const O = ':o:';
      let random1 = Get_Random_Int(0, 1);
      let random2 = Math.abs(random1 - 1); // ensures it being 0 or 1

      // If only both mentions are the same player
      if (mentions.length == 1) {
        random1 = 0;
        random2 = 0;
      }

      // Randomly selects who goes first
      const player1_id = mentions[random1].id;
      const player2_id = mentions[random2].id;
      var turn_id = player1_id;
      var symbol = X;

      // Initial message, calls the user a loser if they're playing the game with themself :)
      let initial_message = `Game match between <@${player1_id}> and <@${player2_id}>!`;
      if (player1_id == player2_id) {
        initial_message += '\n_(What a loser, playing this game with yourself :joy:)_'
      }

      const embed = new MessageEmbed()
      .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/tictactoe.png?raw=true')
      .addField('Tic-tac-toe!', initial_message, true)
      .setColor(default_embed_color);

      // Send initial message
      Reply_Successful_Command(embed, message);

      // Send Tic-tac-toe grid
      // await to send first and get grid_message safely
      var grid_message;
      var grid = [
        [':one:', ':two:', ':three:'],
        [':four:', ':five:', ':six:'],
        [':seven:', ':eight:', ':nine:']
      ];
      // Function to convert the grid array into readable emojis on Discord
      const Join_2D_Array = (array, sep_inner, sep_outer) => {
        let result = [];
        array.forEach(row => {
          result.push(row.join(sep_inner));
        });
        return result.join(sep_outer);
      };
      await message.channel.send(Join_2D_Array(grid, '', '\n'))
      .then((mes) => grid_message = mes)
      .then(() => console.log("Successful tictactoe grid message init"))
      .catch(console.error);

      // Send ui init
      // await to send second and get reaction_message safetly
      var reaction_message;
      await message.channel.send('Loading... Please wait for the :ok: reaction.')
      .then(async (mes) => { //Async to order requests
        await mes.react('1⃣');
        await mes.react('2⃣');
        await mes.react('3⃣');
        await mes.react('4⃣');
        await mes.react('5⃣');
        await mes.react('6⃣');
        await mes.react('7⃣');
        await mes.react('8⃣');
        await mes.react('9⃣');
        await mes.react('🆗');

        reaction_message = await mes;
      })
      .then(() => console.log("Successful tictactoe reaction message init"))
      .catch(console.error);

      // After loading initial reactions, update to state which player's turn
      // await to edit previous message safetly and get reaction_message safetly
      await reaction_message.edit(`It\'s <@${turn_id}>\'s turn! Your symbol is ${symbol}`)
      .then(() => console.log("Successful tictactoe reaction message edit"))
      .catch(console.error);

      // Reaction collector
      const filter = (reaction, user) => user.id == turn_id;
      const collector = reaction_message.createReactionCollector(filter, { time: 600000 , dispose: true });
      console.log("Successful reaction collector init");

      collector.on('collect', (reaction, user) => {

        switch (reaction.emoji.identifier) {
          case '1%E2%83%A3':
            if (grid[0][0] != ':one:') return;
            grid[0][0] = symbol;
            break;
          case '2%E2%83%A3':
            if (grid[0][1] != ':two:') return;
            grid[0][1] = symbol;
            break;
          case '3%E2%83%A3':
            if (grid[0][2] != ':three:') return;
            grid[0][2] = symbol;
            break;
          case '4%E2%83%A3':
            if (grid[1][0] != ':four:') return;
            grid[1][0] = symbol;
            break;
          case '5%E2%83%A3':
            if (grid[1][1] != ':five:') return;
            grid[1][1] = symbol;
            break;
          case '6%E2%83%A3':
            if (grid[1][2] != ':six:') return;
            grid[1][2] = symbol;
            break;
          case '7%E2%83%A3':
            if (grid[2][0] != ':seven:') return;
            grid[2][0] = symbol;
            break;
          case '8%E2%83%A3':
            if (grid[2][1] != ':eight:') return;
            grid[2][1] = symbol;
            break;
          case '9%E2%83%A3':
            if (grid[2][2] != ':nine:') return;
            grid[2][2] = symbol;
            break;
          default:
            return;
        };
        
        // Replace the number emoji with X or O
        grid_message.edit(Join_2D_Array(grid, '', '\n'))
        .then(() => console.log("Successful tictactoe grid message edit"))
        .catch(console.error);

        // Check if the game has concluded
        let is_concluded_win = false;
        let is_concluded_tie = false;
        
        // Diagonal checks
        if (grid[0][0] == symbol && grid[1][1] == symbol && grid[2][2] == symbol) is_concluded_win = true;
        else if (grid[0][2] == symbol && grid[1][1] == symbol && grid[2][0] == symbol) is_concluded_win = true;
        else {
          for (let i = 0; i < grid.length; i++) {
            // Horizontal checks
            if (grid[i][0] == symbol && grid[i][1] == symbol && grid[i][2] == symbol) is_concluded_win = true;
            else if (grid[0][i] == symbol && grid[1][i] == symbol && grid[2][i] == symbol) is_concluded_win = true;
          }
        }
        // Tie checks
        if (grid.flat().every(cell => cell == X || cell == O) && !is_concluded_win) {
          is_concluded_tie = true;
        }
        
        // Conclusion edits
        if (is_concluded_win) {
          reaction_message.edit(`Congratulations! <@${turn_id}> won!`)
          .then(() => console.log("Successful tictactoe reaction message edit"))
          .catch(console.error);

          collector.stop();
          return;
        }
        else if (is_concluded_tie) {
          reaction_message.edit('Boo! It\'s a tie.')
          .then(() => console.log("Successful tictactoe reaction message edit"))
          .catch(console.error);

          collector.stop();
          return;
        }

        // Turn system
        turn_id = turn_id == player1_id ? player2_id : player1_id;
        symbol = symbol == X ? O : X;
        reaction_message.edit(`It\'s <@${turn_id}>\'s turn! Your symbol is ${symbol}`)
        .then(() => console.log("Successful tictactoe reaction message edit"))
        .catch(console.error);
      });

      // Collector stop message
      collector.on('end', collected => {
        console.log("Successful tictactoe reaction listener termination");
      });

    }
    else {
      return Reply_Usage_Error(message, this.name, this.usage);
    }

  }
}
