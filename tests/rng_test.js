
// test rng command

const assert = require('chai').assert;
const Discord = require('discord.js');
const rng = require('../js/commands/rng.js');

//util
const util = require('./util.js');
let prefix = util.prefix;
let message = util.mock_message();
let toggle_log = util.toggle_log;

describe('rng', () => {
  it('should return an error reply logged as a string (no arguments)', () => {

    message.content = prefix + "rng";
    let expected = `Successful error reply to ${message.content}`;
    toggle_log();
    let actual = rng(Discord, message, prefix);
    toggle_log();

    assert.equal(expected, actual);

  });

  it('should return an error reply logged as a string (invalid syntax: no comma)', () => {

    message.content = prefix + "rng 1 100";
    let expected = `Successful error reply to ${message.content}`;
    toggle_log();
    let actual = rng(Discord, message, prefix);
    toggle_log();

    assert.equal(expected, actual);

  });

  it('should return an error reply logged as a string (invalid syntax: not numbers)', () => {

    message.content = prefix + "rng a b";
    let expected = `Successful error reply to ${message.content}`;
    toggle_log();
    let actual = rng(Discord, message, prefix);
    toggle_log();

    assert.equal(expected, actual);

  });

  it('should return RichEmbed with rng properties (+n1, +n2)', () => {

    let min = 1;
    let max = 100;
    message.content = prefix + `rng ${min}, ${max}`;
    toggle_log();
    let actual = rng(Discord, message, prefix);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // check min
    expect = min;
    assert.equal(min, actual.fields[0].value);
    // check max
    expect = max;
    assert.equal(max, actual.fields[1].value);
    //check result inside interval of [min, max]
    let random = actual.fields[2].value.substring(1, actual.fields[2].value.length - 1);
    assert.isAtLeast(parseInt(random), min);
    assert.isAtMost(parseInt(random), max);

  });

  it('should return RichEmbed with rng properties (+n1, +n2, reversed)', () => {

    let min = 1;
    let max = 100;
    message.content = prefix + `rng ${max}, ${min}`;
    toggle_log();
    let actual = rng(Discord, message, prefix);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // check min
    expect = min;
    assert.equal(min, actual.fields[0].value);
    // check max
    expect = max;
    assert.equal(max, actual.fields[1].value);
    //check result inside interval of [min, max]
    let random = actual.fields[2].value.substring(1, actual.fields[2].value.length - 1);
    assert.isAtLeast(parseInt(random), min);
    assert.isAtMost(parseInt(random), max);

  });

  it('should return RichEmbed with rng properties (-n1, +n2)', () => {

    let min = -100;
    let max = 100;
    message.content = prefix + `rng ${min}, ${max}`;
    toggle_log();
    let actual = rng(Discord, message, prefix);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // check min
    expect = min;
    assert.equal(min, actual.fields[0].value);
    // check max
    expect = max;
    assert.equal(max, actual.fields[1].value);
    //check result inside interval of [min, max]
    let random = actual.fields[2].value.substring(1, actual.fields[2].value.length - 1);
    assert.isAtLeast(parseInt(random), min);
    assert.isAtMost(parseInt(random), max);

  });

  it('should return RichEmbed with rng properties (-n1, +n2, reversed)', () => {

    let min = -100;
    let max = 100;
    message.content = prefix + `rng ${max}, ${min}`;
    toggle_log();
    let actual = rng(Discord, message, prefix);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // check min
    expect = min;
    assert.equal(min, actual.fields[0].value);
    // check max
    expect = max;
    assert.equal(max, actual.fields[1].value);
    //check result inside interval of [min, max]
    let random = actual.fields[2].value.substring(1, actual.fields[2].value.length - 1);
    assert.isAtLeast(parseInt(random), min);
    assert.isAtMost(parseInt(random), max);

  });

  it('should return RichEmbed with rng properties (-n1, -n2)', () => {

    let min = -100;
    let max = -1;
    message.content = prefix + `rng ${min}, ${max}`;
    toggle_log();
    let actual = rng(Discord, message, prefix);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // check min
    expect = min;
    assert.equal(min, actual.fields[0].value);
    // check max
    expect = max;
    assert.equal(max, actual.fields[1].value);
    //check result inside interval of [min, max]
    let random = actual.fields[2].value.substring(1, actual.fields[2].value.length - 1);
    assert.isAtLeast(parseInt(random), min);
    assert.isAtMost(parseInt(random), max);

  });

  it('should return RichEmbed with rng properties (-n1, -n2, reversed)', () => {

    let min = -100;
    let max = -1;
    message.content = prefix + `rng ${max}, ${min}`;
    toggle_log();
    let actual = rng(Discord, message, prefix);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // check min
    expect = min;
    assert.equal(min, actual.fields[0].value);
    // check max
    expect = max;
    assert.equal(max, actual.fields[1].value);
    //check result inside interval of [min, max]
    let random = actual.fields[2].value.substring(1, actual.fields[2].value.length - 1);
    assert.isAtLeast(parseInt(random), min);
    assert.isAtMost(parseInt(random), max);

  });

})
