const { MessageEmbed, MessageButton, MessageActionRow, Message } = require("discord.js");
const { default_embed_color } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRandomInt } = require('../utilities');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play rock paper scissors'),

  async execute(interaction) {
    // Build RPS buttons
    const rps = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('rock')
          .setLabel('Rock')
          .setStyle('PRIMARY')
      ).addComponents(
        new MessageButton()
          .setCustomId('paper')
          .setLabel('Paper')
          .setStyle('SUCCESS')
      ).addComponents(
        new MessageButton()
          .setCustomId('scissors')
          .setLabel('Scissors')
          .setStyle('DANGER')
      );
    await interaction.reply({ content: 'Choose one: (instance will timeout in 30 seconds)', components: [rps]});

    // Listen to button presses from original user
    const filter = i => {
      // Don't need to defer?
      // i.deferUpdate();
      return i.user.id === interaction.user.id && i.message.interaction.id === interaction.id;
    };
    await interaction.channel.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 30000 })
      .then(button => { // RPS mechanics
        user_choice = button.customId;
        bot_choice = ['rock', 'paper', 'scissors'][getRandomInt(0,2)]

        // map key pair: what is strong against what
        const strong_against = {
          'rock': 'scissors',
          'paper': 'rock',
          'scissors': 'paper'
        };

        // win, lose, tie messages
        const win = ':boom: _it\'s super effective!_';
        const lose = ':skull: _it\'s not very effective..._';
        const tie = ':zzz: _but nothing happened._';

        // rps compare
        let result;
        if (strong_against[user_choice] == bot_choice) result = win
        else if (strong_against[bot_choice] == user_choice) result = lose
        else result = tie

        const embed = new MessageEmbed()
          .setAuthor(`Rock-Paper-Scissors`)
          .addField('You used', user_choice, true)
          .addField('Beldum used', bot_choice, true)
          .addField('Result', result)
          .setColor(default_embed_color);

        return embed;
      })
      .then(embed => interaction.editReply({ embeds: [embed], content: ' ', components: [] })) // remove original message
      .catch(timeout => { // timeout
        rps.components.forEach(component => {
          component.setDisabled(true);
        });
        interaction.editReply({ content: 'RPS instance timed out, please create another RPS instance', components: [rps]})
    });
  }
}
