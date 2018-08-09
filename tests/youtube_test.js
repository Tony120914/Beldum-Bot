
// test youtube command

const assert = require('chai').assert;
const Discord = require('discord.js');
const youtube = require('../js/commands/youtube.js');

//util
const util = require('./util.js');
let prefix = util.prefix;
let message = util.mock_message();
let toggle_log = util.toggle_log;


describe('youtube', () => {
  it('should return an error reply logged as a string (no arguments)', () => {

    // no arguments (didn't search for anythng)
    message.content = prefix + "youtube";

    let expect = `Successful error reply to ${message.content}`;

    toggle_log();
    let actual = youtube(Discord, message, prefix);
    toggle_log();

    assert.equal(expect, actual);

  })

  it('should return RichEmbed with youtube properties (casual usage)', () => {

    let keywords = "rick roll";
    message.content = prefix + 'youtube ' + keywords;

    // YouTube URL for searching
    let youtube_url = 'https://www.youtube.com/results?search_query=';
    youtube_url += keywords;
    // Replacing spaces with +
    youtube_url = youtube_url.replace(/ /g, '+');

    toggle_log();
    let actual = youtube(Discord, message, prefix);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // correct keywords to search for
    expect = keywords.substring(0, 1024);
    assert.equal(expect, actual.fields[0].value);
    // correct resulting URL
    expect = youtube_url.substring(0, 1024);
    assert.equal(expect, actual.fields[1].value);
  })

  it('should return RichEmbed with youtube properties (extreme usage)', () => {

    // testing the 1024 character limit
    let keywords = "blah".repeat(256 + 1);
    assert.isAtLeast(keywords.length, 1024);

    message.content = prefix + 'youtube ' + keywords;

    // YouTube URL for searching
    let youtube_url = 'https://www.youtube.com/results?search_query=';
    youtube_url += keywords;
    // Replacing spaces with +
    youtube_url = youtube_url.replace(/ /g, '+');

    toggle_log();
    let actual = youtube(Discord, message, prefix);
    toggle_log();

    // instance of RichEmbed
    let expect = Discord.RichEmbed;
    assert.instanceOf(actual, expect);
    // correct keywords to search for
    expect = keywords.substring(0, 1024);
    assert.equal(expect, actual.fields[0].value);
    // correct resulting URL
    expect = youtube_url.substring(0, 1024);
    assert.equal(expect, actual.fields[1].value);
  })
})
