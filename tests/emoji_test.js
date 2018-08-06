
// test emoji command

const assert = require('chai').assert;
const Discord = require('discord.js');
const emoji = require('../js/commands/emoji.js');

//util
const util = require('./util.js');
let prefix = util.prefix;
let message = util.mock_message();

describe('emoji: invalid syntax or invalid emoji', () => {
  it('should return an error reply logged as a string', () => {

    // no arguments
    message.content = prefix + "emoji";
    Object.defineProperty(message, 'guild', {
      value: {emojis : {find : function(type, id){return null;}}},
      enumerable: true,
      configurable: true,
    })
    let expect = `Successful error reply to ${message.content}`;
    let actual = emoji(Discord, message, prefix);
    assert.equal(expect, actual);

    // emoji doesn't exist or unavailable to server
    message.content = prefix + "emoji <:invalid_emoji_name:123456>";
    expect = `Successful error reply to ${message.content}`;
    actual = emoji(Discord, message, prefix);
    assert.equal(expect, actual);

  })
})

describe('emoji: valid command', () => {
  it('should return RichEmbed with certain properties', () => {

    message.content = prefix + "emoji <:valid_emoji_name:123456>";
    Object.defineProperty(message, 'guild', {
      value: {emojis : {find : function(...mock){return {url : 'emoji.url'};}}},
      enumerable: true,
      configurable: true,
    })
    console.log(message.guild.emojis.find('name', 123))

    let actual = emoji(Discord, message, prefix);

    // instance of RichEmbed
    assert.instanceOf(actual, Discord.RichEmbed);

  })
})
