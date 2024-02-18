import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE, INTERACTION_RESPONSE_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'

const applicationCommand = new ApplicationCommand(
    'ping',
    'Check Beldum-Bot\'s ping.',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const execute = async function(interaction: object, env: any) {
    const start = Date.now();
    await fetch(env.INTERACTIONS_ENDPOINT, {
        headers: {
            'User-Agent': 'Beldum-Bot/1.0.0 (Discord Bot)'
        }
    });
    const end = Date.now();
    const ping = Math.abs(end - start);
    let emoji: string;
    if (ping < 100) { emoji = ':rocket:'; }
    else if (ping < 200) { emoji = ':red_car:'; }
    else { emoji = ':snail:'; }

    const embed = new Embed();
    embed.setTitle('Ping');
    embed.setDescription(`${emoji} ${ping} ms`);
    
    const interactionResponse = new InteractionResponse(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    interactionResponse.data?.addEmbed(embed);

    return interactionResponse;
}

/**
 * Ping Command
 */
export const Ping = new Command(applicationCommand, execute);
