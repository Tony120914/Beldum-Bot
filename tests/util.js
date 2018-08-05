
const Discord = require('discord.js');

module.exports = {

  prefix : '//',

  mock_message : () => {
    let message = new Discord.Message('somechannel');
    message.channel = mock_property(message);
    message.reply = mock_function(message);
    message.then = mock_function(message);
    message.catch = mock_function(message);
    message.send = mock_function(message);
    return message;
  },

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
