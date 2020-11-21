const { MessageEmbed, Message } = require("discord.js");
const { prefix, default_embed_color } = require('../../config.json');
const { Reply_Successful_Command, Reply_Usage_Error } = require('../utilities.js');

module.exports = {
  name: 'generatemd',
  aliases: ['generate_md'],
  description: 'Generate documentation of commands for README.md.',
  args: false,
  usage: '',

  execute(message, arguments) {
      const commands = message.client.commands;

      const header_1 = '| <img width=475px> Commands <img width=475px> | Aliases | <img width=500px> Usage Examples <img width=500px> | Descriptions |';
      const header_2 = '| --- | --- | --- | --- |';
      var string = '';
      string = string.concat('\n', header_1);
      string = string.concat('\n', header_2);

      commands.forEach(cmd => {
          const command = `\`${prefix}${cmd.name} ${cmd.usage}\``;
          const aliases = `${cmd.aliases.join('\n')}`;
          const examples = `${cmd.examples}`;
          const description = `${cmd.description}`;
          var line = `| ${command} | ${aliases} | ${examples} | ${description} |`;
          // replace lines that contain \n with <br> for .md file
          line = line.replace(/\n/g, '<br>');
          string = string.concat('\n', line);
      });

      console.log(string);

  }
  
}
