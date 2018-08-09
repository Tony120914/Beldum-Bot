
// test rps command

const assert = require('chai').assert;
const Discord = require('discord.js');
const rps = require('../js/commands/rps.js');

//util
const util = require('./util.js');
let prefix = util.prefix;
let message = util.mock_message();
let toggle_log = util.toggle_log;

describe('rps', () => {
  it('should return an error reply logged as a string (no arguments)', () => {

    message.content = prefix + "rps";
    let expected = `Successful error reply to ${message.content}`;
    toggle_log();
    let actual = rps(Discord, message, prefix);
    toggle_log();

    assert.equal(expected, actual);

  });

  it('should return an error reply logged as a string (invalid arguments)', () => {

    message.content = prefix + "rps blah blah blah";
    let expected = `Successful error reply to ${message.content}`;
    toggle_log();
    let actual = rps(Discord, message, prefix);
    toggle_log();

    assert.equal(expected, actual);

  });

  it('should return RichEmbed with rps properties', () => {

    // Rock, paper, scissors
    const rps_emojis = [':new_moon:',
                        ':newspaper:',
                        ':scissors:'
                       ];
    // Win, Lose, Tie
    const results = ['_it\'s super effective!_',
                     '_it\'s not very effective..._',
                     '_but nothing happened..._'
                    ];

    const input = ['r', 'p', 's',
                   'r', 'p', 's',
                   'r', 'p', 's'
                  ];

    // multi tests due to rng
    for (let i = 0; i < input.length; i++){
      message.content = prefix + `rps ${input[i]}`;
      toggle_log();
      let actual = rps(Discord, message, prefix);
      toggle_log();

      // instance of RichEmbed
      let expect = Discord.RichEmbed;
      assert.instanceOf(actual, expect);
      // check user choice equals input
      // Convert r/p/s to emoji variant
      let user_choice = message.content.substring((prefix + 'rps ').length);
      if (user_choice == 'r') {
        user_choice = rps_emojis[0];
      }
      else if (user_choice == 'p') {
        user_choice = rps_emojis[1];
      }
      else if (user_choice == 's') {
        user_choice = rps_emojis[2];
      }
      expect = user_choice;
      assert.equal(expect, actual.fields[0].value);
      // check bot choice in rps
      let bot_choice = actual.fields[1].value;
      assert.isTrue(rps_emojis.includes(bot_choice));

      //check result is valid on win, lose, or tie
      expect = actual.fields[2].value;
      // Case 1: user wins
      if (user_choice == rps_emojis[0] && bot_choice == rps_emojis[2] ||
          user_choice == rps_emojis[2] && bot_choice == rps_emojis[1] ||
          user_choice == rps_emojis[1] && bot_choice == rps_emojis[0]) {
            assert.equal(expect, results[0]);
      }

      // Case 2: bot wins
      else if (user_choice == rps_emojis[0] && bot_choice == rps_emojis[1] ||
               user_choice == rps_emojis[1] && bot_choice == rps_emojis[2] ||
               user_choice == rps_emojis[2] && bot_choice == rps_emojis[0]) {
                 assert.equal(expect, results[1]);
      }

      // Case 3: tie
      else {
        assert.equal(expect, results[2]);
      }
    }
  });
})
