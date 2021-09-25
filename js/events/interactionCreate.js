const log = require('../logger').getLogger();

// Listen for interactions
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
    if (!interaction.isCommand()) return;
  
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
  
    try {
      try {
        log.info(`/${interaction.commandName} ${interaction.options.getSubcommand()}`)
      }
      catch {
        log.info(`/${interaction.commandName}`)
      }
      await command.execute(interaction);
    }
    catch (error) {
      log.error(error);
      await interaction.reply({ content: 'Error', ephemeral: true })
    }
	},
};
