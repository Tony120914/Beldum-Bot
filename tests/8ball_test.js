
// test 8ball command

const assert = require('chai').assert;
const Discord = require('discord.js');
const _8ball = require('../js/commands/8ball.js');

//util
const util = require('./util.js');
let prefix = util.prefix;
let message = util.mock_message();
let toggle_log = util.toggle_log;

describe('8ball: invalid syntax', () => {
  it('should return an error reply logged as a string', () => {

    message.content = prefix + "8ball";
    let expected = `Successful error reply to ${message.content}`;
    toggle_log();
    let actual = _8ball(Discord, message, prefix);
    toggle_log();

    assert.equal(expected, actual);
  });
})

describe('8ball: valid command', () => {
  it('should return RichEmbed with certain properties', () => {

    message.content = prefix + "8ball yes/no question";
    let answers = [
      // Yes - answers
      'Oh yeah, 100%',
      'Very likely',
      'Science says yes',
      '_Beldum interrupts_ **AFFIRMATIVE.**',

      // Maybe - answers
      'Maybe...',
      '_Beldum interrupts_ **INDETERMINATE**',

      // No - answers
      'Hahaha. No.',
      'Only in your wildest dreams',
      'Probably not',
      '_Beldum interrupts_ **NEGATIVE.**',
    ];

    // test multi times because of rng
    for (let i = 0; i < answers.length; i++) {
      toggle_log();
      let actual = _8ball(Discord, message, prefix);
      toggle_log();

      // instance of RichEmbed
      assert.instanceOf(actual, Discord.RichEmbed);

      // 8ball reply is within answers
      assert.isTrue(answers.includes(actual.fields[0].value));
    }
  })
})
