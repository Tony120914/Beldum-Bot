const { MessageEmbed, Message } = require("discord.js");
const { prefix, default_embed_color } = require('../../config.json');
const { Reply_Successful_Command, Reply_Usage_Error } = require('../utilities.js');

module.exports = {
  name: 'help',
  aliases: ['command', 'commands'],
  description: 'List all commands (detailed help presented if specific command name is provided as an argument).',
  args: false, // optional arguments
  usage: '<optional command name>',
  examples: `${prefix}help\n${prefix}help 8ball`,

  execute(message, arguments) {
    const commands = message.client.commands;

    // List help for all commands
    if (arguments.length == 0) {
      const command_usages = commands.map(command => `${prefix}${command.name} ${command.usage}`).join('\n');

      embed = new MessageEmbed()
      .setAuthor('Commands')
      .setDescription(`\`${command_usages}\``)
      .addField('Need help on specific command?', '//help <command>', true)
      .addField('Need usage examples?',
        'Visit [here](https://github.com/Tony120914/Beldum-Bot/blob/master/README.md) to view more detailed descriptions and usage examples of commands!', true)
      .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/479Rotom-Pok%C3%A9dex.png?raw=true')
      .setColor(default_embed_color);
      
      Reply_Successful_Command(embed, message);

      return embed;
    }
    // List help for a specific command
    else if (arguments.length == 1) {
      const command_name = arguments[0].toLowerCase();
      const command = commands.get(command_name) || commands.find(com => com.aliases && com.aliases.includes(command_name));

      if (!command) {
        return Reply_Usage_Error(message, this.name, this.usage, '(this command does not exist)');
      }

      embed = new MessageEmbed()
      .addField('Command', command.name, true)
      .addField('Aliases', command.aliases.join(', '), true)
      .addField('Description', command.description)
      .addField('Usage', `\`${prefix}${command.name} ${command.usage}\``)
      .setThumbnail('https://github.com/Tony120914/Beldum-Bot/blob/master/images/479Rotom-Pok%C3%A9dex.png?raw=true')
      .setColor(default_embed_color);
      
      Reply_Successful_Command(embed, message);

      return embed;
    }
    else {
      return Reply_Usage_Error(message, this.name, this.usage);
    }

  }
}
