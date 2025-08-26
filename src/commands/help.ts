import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE } from '../templates/discord/Enums.js';
import { Info } from './info.js';
import type { Interaction } from '../templates/discord/InteractionReceive.js';

const applicationCommand = new ApplicationCommand(
    'help',
    'Get information on the bot and resources on how to use the bot.',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const execute = async function(interaction: Interaction, env: Env, args: string[]) {
    // Redirect to 'info bot' command
    args = ['info', 'bot'];
    return Info.execute(interaction, env, args);
}

/**
 * Help Command
 */
export const Help = new Command(applicationCommand, execute);
