import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE, BUTTON_STYLE, INTERACTION_CALLBACK_TYPE, INTERACTION_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { getRandomInt } from '../handlers/Utils.js';
import { ActionRow, ButtonNonLink } from '../templates/discord/MessageComponents.js';
import { isOriginalUserInvoked } from '../handlers/InteractionHandler.js';
import { ephemeralError } from '../handlers/ErrorHandler.js';
import type { Interaction } from '../templates/discord/InteractionReceive.js';

const applicationCommand = new ApplicationCommand(
    'cointoss',
    'Toss a coin, heads or tails. (Fun fact: there\'s a 1/6000 chance of a coin landing on its edge.)',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const execute = async function(interaction: Interaction, env: Env, args: string[]) {
    const interactionResponse = new InteractionResponse(INTERACTION_CALLBACK_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    const data = interactionResponse.initMessageData();
    let history = '';
    if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
        if (!isOriginalUserInvoked(interaction)) {
            return ephemeralError(interactionResponse, 'Error: You are not the original user who triggered the interaction. Please invoke a new slash command.');
        }
        interactionResponse.setType(INTERACTION_CALLBACK_TYPE.UPDATE_MESSAGE);
        history = interaction.data?.custom_id || '';
    }

    const avgEdgeAttempts = 6000;
    const randomInt = getRandomInt(0, avgEdgeAttempts * 2 - 1); // 0 - 11999
    let result: string;
    let imgUrl: string;
    if (randomInt < avgEdgeAttempts - 1) {
        // Heads: 0 - 5998
        result = 'Heads';
        imgUrl = 'https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/assets/cointoss-heads.png';
    }
    else if (randomInt < ((avgEdgeAttempts - 1) * 2)) {
        // Tails: 5999 - 11997
        result = 'Tails';
        imgUrl = 'https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/assets/cointoss-tails.png';
    }
    else {
        // Edge: 11998 - 11999
        result =
            'Edge... wait what?\n' +
            '(Fun fact: [there\'s a 1/6000 chance of a coin landing on its edge.](https://journals.aps.org/pre/abstract/10.1103/PhysRevE.48.2547))';
        imgUrl = 'https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/assets/cointoss-edge.png';
    }

    const embed = new Embed();
    embed.setTitle('Coin Toss');
    embed.setDescription(result);
    embed.image?.setUrl(imgUrl);
    history = `${history}${result[0]}`;
    embed.initFooter(`History: ${history}`);
    data.addEmbed(embed);

    const button = new ButtonNonLink(history, BUTTON_STYLE.PRIMARY); // Passing data through custom_id
    button.setLabel('Toss again');
    button.setEmoji(undefined, '🔁');
    const actionRow = new ActionRow();
    actionRow.addComponent(button);
    data.addComponent(actionRow);

    return interactionResponse;
}

/**
 * Coin Toss Command
 */
export const CoinToss = new Command(applicationCommand, execute);
