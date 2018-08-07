
// test avatar command

const assert = require('chai').assert;
const Discord = require('discord.js');
const avatar = require('../js/commands/avatar.js');

//util
const util = require('./util.js');
let prefix = util.prefix;
let message = util.mock_message();

describe('avatar: invalid syntax', () => {
  it('should return an error reply logged as a string', () => {

    // no arguments
    message.content = prefix + "avatar";
    message.mentions = {users : {array : function(){return [];}}};
    let expect = `Successful error reply to ${message.content}`;
    let actual = avatar(Discord, message, prefix);
    assert.equal(expect, actual);

    // no avatar
    message.content = prefix + "avatar @someone_without_avatar";
    message.mentions.users.array = function(){return ['@someone_without_avatar'];};
    message.mentions.users.first = function(){return {avatar : null};};
    expect = `Successful error reply to ${message.content}`;
    actual = avatar(Discord, message, prefix);
    assert.equal(expect, actual);

  })
})

describe('avatar: valid command', () => {
  it('should return RichEmbed with certain properties', () => {

    message.content = prefix + "avatar @someone_with_avatar";
    message.mentions = {users : {array : function(){return ['@someone_with_avatar'];}}};
    message.mentions.users.first = function(){return {avatar : 'avatar_id', avatarURL: {url : 'avatar.png'}};};

    let actual = avatar(Discord, message, prefix);

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // correct description
    expect = `${message.mentions.users.first()}'s avatar`;
    assert.equal(expect, actual.description);
    // correct image
    expect = `${message.mentions.users.first().avatarURL}`;
    assert.equal(expect, actual.image);

  })
})
