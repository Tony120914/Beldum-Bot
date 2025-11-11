import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE, INTERACTION_CALLBACK_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import type { Interaction } from '../templates/discord/InteractionReceive.js';

const applicationCommand = new ApplicationCommand(
    'ping',
    'Check Beldum-Bot\'s ping.',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const execute = async function(interaction: Interaction, env: Env, args: string[]) {
    const start = Date.now();
    await fetch(env.INTERACTIONS_ENDPOINT, {
        headers: {
            'User-Agent': env.USER_AGENT
        }
    });
    const end = Date.now();
    const ping = Math.abs(end - start);
    const emoji = pingToEmote(ping);

    const embed = new Embed();
    embed.setTitle('Ping');
    embed.setDescription(`${emoji} ${ping} ms`);
    
    const interactionResponse = new InteractionResponse(INTERACTION_CALLBACK_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    const data = interactionResponse.initMessageData();
    data.addEmbed(embed);

    return interactionResponse;
}

function pingToEmote(ping: number): string {
    if (ping < 100) { return ':rocket:'; }
    else if (ping < 200) { return ':red_car:'; }
    else if (ping < 300) { return ':snail:'; }
    else { return ':skull:'; }
}

/**
 * Ping Command
 */
const Ping = new Command(applicationCommand, execute);
export default Ping;

export const tests = {
    execute,
    pingToEmote
}