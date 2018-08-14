
// test @bot command

const assert = require('chai').assert;
const Discord = require('discord.js');
const client = new Discord.Client();
const ATbot = require('../js/commands/@bot.js');

//util
const util = require('./util.js');
let prefix_mention = util.prefix_mention;
let message = util.mock_message();
let toggle_log = util.toggle_log;

describe('@bot', () => {
  it('should return a confirmation of a prompt to type //info as a string', () => {

    message.content = prefix_mention;

    let expect = `Successful command reply to ${message.content}`;

    toggle_log();
    let actual = ATbot(message);
    toggle_log();

    // response should be a string
    assert.equal(expect, actual);
  })
})
