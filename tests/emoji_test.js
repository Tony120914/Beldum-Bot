
// test emoji command

const assert = require('chai').assert;
const Discord = require('discord.js');
const emoji = require('../js/commands/emoji.js');

//util
const util = require('./util.js');
let prefix = util.prefix;
let message = util.mock_message();
let toggle_log = util.toggle_log;

describe('emoji', () => {
  it('should return an error reply logged as a string (no arguments)', () => {

    // no arguments
    message.content = prefix + "emoji";
    Object.defineProperty(message, 'guild', {
      value: {emojis : {find : function(type, id){return null;}}},
      enumerable: true,
      configurable: true,
    })

    let expect = `Successful error reply to ${message.content}`;
    toggle_log();
    let actual = emoji(Discord, message, prefix);
    toggle_log();
    assert.equal(expect, actual);

  })

  it('should return an error reply logged as a string (emoji unavailable)', () => {

    // emoji doesn't exist or unavailable to server
    message.content = prefix + "emoji <:invalid_emoji_name:123456>";
    Object.defineProperty(message, 'guild', {
      value: {emojis : {find : function(type, id){return null;}}},
      enumerable: true,
      configurable: true,
    })

    let expect = `Successful error reply to ${message.content}`;
    toggle_log();
    let actual = emoji(Discord, message, prefix);
    toggle_log();
    assert.equal(expect, actual);

  })

  it('should return RichEmbed with emoji properties', () => {

    message.content = prefix + "emoji <:valid_emoji_name:123456>";
    Object.defineProperty(message, 'guild', {
      value: {emojis : {find : function(...mock){return {url : 'emoji.url'};}}},
      enumerable: true,
      configurable: true,
    })

    toggle_log();
    let actual = emoji(Discord, message, prefix);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // correct description
    expect = ':valid_emoji_name:';
    assert.equal(expect, actual.description);
    // correct image
    expect = message.guild.emojis.find();
    assert.equal(expect.url, actual.image.url);

  })
})
