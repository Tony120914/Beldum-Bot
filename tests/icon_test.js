
// test icon command

const assert = require('chai').assert;
const Discord = require('discord.js');
const icon = require('../js/commands/icon.js');

//util
const util = require('./util.js');
let prefix = util.prefix;
let message = util.mock_message();
let toggle_log = util.toggle_log;

describe('icon: invalid icon', () => {
  it('should return an error reply logged as a string', () => {

    // icon doesn't exist
    message.content = prefix + "icon";
    Object.defineProperty(message, 'guild', {
      value: {iconURL : null},
      enumerable: true,
      configurable: true,
    })

    let expect = `Successful error reply to ${message.content}`;
    toggle_log();
    let actual = icon(Discord, message, prefix);
    toggle_log();
    assert.equal(expect, actual);

  })
})

describe('icon: valid command', () => {
  it('should return RichEmbed with certain properties (png => png)', () => {

    message.content = prefix + "icon";
    Object.defineProperty(message, 'guild', {
      value: {iconURL : 'icon.png', name : 'server_name'},
      enumerable: true,
      configurable: true,
    })

    toggle_log();
    let actual = icon(Discord, message, prefix);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // correct description
    expect = `${message.guild.name}'s server icon`;
    assert.equal(expect, actual.description);
    // correct image
    expect = message.guild.iconURL;
    assert.equal(expect, actual.image.url);
  })

  it('should return RichEmbed with certain properties (jpg => png)', () => {

    message.content = prefix + "icon";
    Object.defineProperty(message, 'guild', {
      value: {iconURL : 'icon.jpg', name : 'server_name'},
      enumerable: true,
      configurable: true,
    })

    toggle_log();
    let actual = icon(Discord, message, prefix);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // correct description
    expect = `${message.guild.name}'s server icon`;
    assert.equal(expect, actual.description);
    // correct image
    expect = message.guild.iconURL.replace('.jpg', '.png');
    assert.equal(expect, actual.image.url);
  })
})
