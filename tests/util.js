
const Discord = require('discord.js');

const ORIGINAL_CONSOLE_LOG = console.log;
const SUPPRESSED_CONSOLE_LOG = function(){};

module.exports = {

  prefix : '//',

  // creates a mock message
  mock_message : () => {
    let message = new Discord.Message('somechannel');
    message.channel = mock_property(message);
    message.reply = mock_function(message);
    message.then = mock_function(message);
    message.catch = mock_function(message);
    message.send = mock_function(message);
    return message;
  },

  // toggles console.log to log or not
  toggle_log : () => {
    if (console.log === SUPPRESSED_CONSOLE_LOG) {
      console.log = ORIGINAL_CONSOLE_LOG;
    }
    else {
      console.log = SUPPRESSED_CONSOLE_LOG;
    }
  }

}

// mock function that accepts and returns itself (good for dealing with promises)
mock_function = (keep) => {
  return function(...mock) {
    return keep;
  };
}
mock_property = (keep) => {
    return keep;
}
