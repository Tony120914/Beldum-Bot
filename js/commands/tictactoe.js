const { MessageEmbed, MessageButton, MessageActionRow, Message } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const log = require('../logger').getLogger();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tictactoe')
    .setDescription('Play tictactoe with another user (command user will start first)')
    .addMentionableOption(option =>
      option.setName('player2')
        .setDescription('player2')
        .setRequired(true)),

  async execute(interaction) {
    // Build TTT buttons on a grid
    let grid = []
    for (let i = 0; i < 3; i++) {
      let row = new MessageActionRow()
      for (let j = 0; j < 3; j++) {
        row.addComponents(
          new MessageButton()
            .setCustomId(`${j+i*3}`)
            .setLabel(' ')
            .setStyle('PRIMARY')
        );
      } grid.push(row)
    };

    const arg1 = interaction.options.getMentionable('player2');

    // Get players' ids
    const player1 = interaction.user;
    const player2 = arg1.user;
    let turn = player1;
    let symbol = 'X';
    let style = 'SUCCESS';

    // Initial message, calls the user a loser if they're playing the game with themself :)
    let initial_message = `Game match between ${player1} and ${player2}\n(instance will timeout in 2 minutes)`;
    if (player1.id == player2.id) initial_message += '\n**What a loser, playing this game with yourself :joy:**';

    const embed = new MessageEmbed()
      .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/tictactoe.png?raw=true')
      .addField('Tic-tac-toe', initial_message, true)
      .setColor(default_embed_color);
    
    const embed_instructions = new MessageEmbed()
      .addField('Instructions', `${turn}'s' turn to choose a cell, your symbol is ${symbol}`)
      .setColor(default_embed_color);

    await interaction.reply({ content: ' ', embeds: [embed, embed_instructions], components: grid});

    // Listen to button presses from players (if it's their turn)
    const filter = i => {
      // Don't need to defer?
      // i.deferUpdate();
      return i.user.id === turn.id && i.message.interaction.id === interaction.id;
    }
    const button_collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 120000 });
    button_collector.on('collect', async button => { // TTT mechanics
      // update button pressed and disable it
      let comp = grid[Math.floor(button.customId/3)].components[button.customId%3];
      comp.setLabel(symbol)
        .setStyle(style)
        .setDisabled(true);
      
      // check for win/lose/draw
      game_status = checkGameStatus(grid, symbol);
      log.debug(gridToString(grid));

      const embed_instructions = new MessageEmbed()
      if (game_status == 'ongoing') {
        // change turns
        turn = turn.id == player1.id ? player2 : player1;
        symbol = symbol == 'X' ? 'O' : 'X';
        style = style == 'SUCCESS' ? 'DANGER' : 'SUCCESS';

        // update instructions
        embed_instructions
          .addField('Instructions', `${turn}'s' turn to choose a cell, your symbol is ${symbol}`)
          .setColor(default_embed_color);
      }
      else if (game_status == 'draw') {
        // update instructions to draw
        embed_instructions
          .addField('Results', `It's a draw. GG`)
          .setColor(default_embed_color);
      }
      else {
        // update instructions to winner
        embed_instructions
          .addField('Results', `${turn} won. GG`)
          .setColor(default_embed_color);
        // disable the grid because the game is over
        disableGrid(grid);
      }
      await button.update({ embeds: [embed, embed_instructions], components: grid });
    });
      
    button_collector.on('end', async collected => {
      const embed = new MessageEmbed()
        .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/tictactoe.png?raw=true')
        .addField('Tic-tac-toe', 'Tic-Tac-Toe instance timed out, please create a new Tic-Tac-Toe instance', true)
        .setColor(default_embed_color);
      disableGrid(grid);
      await interaction.editReply({ embeds: [embed], components: grid });
    });

  }
}

// Helper to check game status for any game overs
function checkGameStatus(grid, symbol) {
  // check rows
  for (let row of grid) {
    if (row.components.every(cell => cell.label == symbol)) return 'win'
  }
  // check columns
  for (let i = 0; i < 3; i++) {
    if (grid[0].components[i].label == symbol 
      && grid[1].components[i].label == symbol
      && grid[2].components[i].label == symbol) {
        return 'win'
    }
  };
  // check diagonals
  if ((grid[0].components[0].label == symbol
    && grid[1].components[1].label == symbol
    && grid[2].components[2].label == symbol) ||
    (grid[2].components[0].label == symbol
    && grid[1].components[1].label == symbol
    && grid[0].components[2].label == symbol)) {
      return 'win'
  }
  // check draw or ongoing
  for (let row of grid) {
    for (let cell of row.components) {
      if (cell.label == ' ') return 'ongoing';
    }
  }
  grid.forEach(row => {
    //if (row.components.some(cell => cell.label == '')) return 'ongoing'
  });
  // otherwise it's a draw
  return 'draw'
}

// Helper to disable the grid
function disableGrid(grid) {
  grid.forEach(row => {
    row.components.forEach(cell => {
      cell.setDisabled(true);
    });
  });
}

// Helper to visualize TTT grid
function gridToString(grid) {
  let string = '';
  for (let row of grid) {
    let cur = ''
    for (let cell of row.components) {
      cur = `${cur} ${cell.label}`;
    } string = `${string}\n${cur}`;
  }
  return string;
}
