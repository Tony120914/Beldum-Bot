
// test flip command

const assert = require('chai').assert;
const Discord = require('discord.js');
const flip = require('../js/commands/flip.js');

//util
const util = require('./util.js');
let prefix = util.prefix;
let message = util.mock_message();
let toggle_log = util.toggle_log;

describe('flip: valid command', () => {
  it('should return RichEmbed with certain properties', () => {

    message.content = prefix + "flip";

    // [Heads, Tails, Edge]
    const results = [
      'Heads',
      'Tails',
      'What the...',
    ];

    // [Heads, Tails, Edge]
    const result_images = [
      'https://github.com/Tony120914/Beldum-Bot/blob/master/images/heads.png?raw=true',
      'https://github.com/Tony120914/Beldum-Bot/blob/master/images/tails.png?raw=true',
      'https://github.com/Tony120914/Beldum-Bot/blob/master/images/edge.jpg?raw=true'
    ];

    // multi tests because of rng
    for (let i = 0; i < (results.length * result_images.length); i++) {
      toggle_log();
      let actual = flip(Discord, message, prefix);
      toggle_log();

      // instance of RichEmbed
      let expect = Discord.RichEmbed;
      assert.instanceOf(actual, expect);
      // description is within results
      assert.isTrue(results.includes(actual.author.name));
      // image is within result_images
      assert.isTrue(result_images.includes(actual.image.url));
      // result description matches result images
      assert.equal(results.indexOf(actual.author.name), result_images.indexOf(actual.image.url));
    }
  })
})
