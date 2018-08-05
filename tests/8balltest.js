
// test 8ball command

const assert = require('chai').assert;
const Discord = require('discord.js');
const _8ball = require('../js/commands/8ball.js');

//util
const util = require('./util.js');

let message = util.mock_message();

describe('8ball: invalid syntax', () => {
  it('should return log string of error reply', () => {

    message.content = "//8ball";
    let expected = `Successful error reply to ${message.content}`;
    let actual = _8ball(Discord, message, '//');

    assert.equal(expected, actual);
  });
})

describe('8ball: valid command', () => {
  it('should return RichEmbed with certain properties', () => {

    message.content = "//8ball yes/no question";
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
    let expect = new Discord.RichEmbed()
    .setColor('DARK_GOLD')
    .addField(':8ball: The Magic 8-ball', 'ignore', false)
    ;

    let actual = _8ball(Discord, message, '//');

    assert.equal(expect.color, actual.color);
    assert.equal(expect.fields[0].name, actual.fields[0].name);
    assert.equal(expect.fields[0].inline, actual.fields[0].inline);
    assert.isTrue(answers.includes(actual.fields[0].value));

  })
})
