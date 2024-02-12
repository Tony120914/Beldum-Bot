import { ApplicationCommand } from '../templates/ApplicationCommand.js'
import { APPLICATION_COMMAND_TYPE, INTERACTION_RESPONSE_TYPE } from '../templates/DiscordEnums.js';
import { Embed } from '../templates/Embed.js';
import { InteractionResponse } from '../templates/InteractionResponse.js'

/**
 * Ping Command
 */
export const Ping = new ApplicationCommand(
    'ping',
    'Check Beldum-Bot\'s ping.',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT,

    async (interaction: object, env: any) => {
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
);
