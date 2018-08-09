
// test ping command

const assert = require('chai').assert;
const Discord = require('discord.js');
const client = new Discord.Client();
const ping = require('../js/commands/ping.js');

//util
const util = require('./util.js');
let prefix = util.prefix;
let message = util.mock_message();
let toggle_log = util.toggle_log;

describe('ping', () => {
  it('should return the client\'s ping as an integer', () => {

    message.content = prefix + "ping";
    Object.defineProperty(client, 'ping', {
      value: 5.5,
      enumerable: true,
      configurable: true,
    })

    toggle_log();
    let actual = ping(message, client);
    toggle_log();

    // ping value is an integer
    assert.isTrue(Number.isInteger(actual));
  })
})
