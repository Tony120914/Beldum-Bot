
// test report command

const assert = require('chai').assert;
const Discord = require('discord.js');
const report = require('../js/commands/report.js');

//util
const util = require('./util.js');
let prefix = util.prefix;
let creator_id = util.creator_id;
let message = util.mock_message();
let toggle_log = util.toggle_log;

describe('report', () => {
  it('should return RichEmbed with report properties', () => {

    message.content = prefix + "report";

    toggle_log();
    let actual = report(Discord, message, prefix, creator_id);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
  })
})
