
// test google command

const assert = require('chai').assert;
const Discord = require('discord.js');
const google = require('../js/commands/google.js');

//util
const util = require('./util.js');
let prefix = util.prefix;
let message = util.mock_message();
let toggle_log = util.toggle_log;


describe('google: invalid syntax', () => {
  it('should return an error reply logged as a string', () => {

    // no arguments (didn't search for anythng)
    message.content = prefix + "google";

    let expect = `Successful error reply to ${message.content}`;

    toggle_log();
    let actual = google(Discord, message, prefix);
    toggle_log();

    assert.equal(expect, actual);

  })
})

describe('google: valid command', () => {
  it('should return RichEmbed with certain properties (casual usage)', () => {

    let keywords = "what is the meaning of life?";
    message.content = prefix + 'google ' + keywords;

    // Google URL for searching
    let google_url = 'https://www.google.com/search?q=';
    google_url += keywords;
    // Replacing spaces with +
    google_url = google_url.replace(/ /g, '+');

    toggle_log();
    let actual = google(Discord, message, prefix);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // correct keywords to search for
    expect = keywords.substring(0, 1024);
    assert.equal(expect, actual.fields[0].value);
    // correct resulting URL
    expect = google_url.substring(0, 1024);
    assert.equal(expect, actual.fields[1].value);
  })

  it('should return RichEmbed with certain properties (extreme usage)', () => {

    // testing the 1024 character limit
    let keywords = "blah".repeat(256 + 1);
    assert.isAtLeast(keywords.length, 1024);

    message.content = prefix + 'google ' + keywords;

    // Google URL for searching
    let google_url = 'https://www.google.com/search?q=';
    google_url += keywords;
    // Replacing spaces with +
    google_url = google_url.replace(/ /g, '+');

    toggle_log();
    let actual = google(Discord, message, prefix);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // correct keywords to search for
    expect = keywords.substring(0, 1024);
    assert.equal(expect, actual.fields[0].value);
    // correct resulting URL
    expect = google_url.substring(0, 1024);
    assert.equal(expect, actual.fields[1].value);
  })
})
