import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE, INTERACTION_RESPONSE_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse, MessageData } from '../templates/discord/InteractionResponse.js'

const applicationCommand = new ApplicationCommand(
    'ping',
    'Check Beldum-Bot\'s ping.',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const execute = async function(interaction: any, env: any, args: string[]) {
    const start = Date.now();
    await fetch(env.INTERACTIONS_ENDPOINT, {
        headers: {
            'User-Agent': env.USER_AGENT
        }
    });
    const end = Date.now();
    const ping = Math.abs(end - start);
    let emoji: string;
    if (ping < 100) { emoji = ':rocket:'; }
    else if (ping < 200) { emoji = ':red_car:'; }
    else if (ping < 300) { emoji = ':snail:'; }
    else { emoji = ':skull:'; }

    const embed = new Embed();
    embed.setTitle('Ping');
    embed.setDescription(`${emoji} ${ping} ms`);
    
    const interactionResponse = new InteractionResponse(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE, new MessageData());
    interactionResponse.data?.addEmbed(embed);

    return interactionResponse;
}

/**
 * Ping Command
 */
export const Ping = new Command(applicationCommand, execute);
