import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE, BUTTON_STYLE, INTERACTION_RESPONSE_TYPE, INTERACTION_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { getRandomInt } from '../handlers/Utils.js';
import { ActionRow, ButtonNonLink } from '../templates/discord/MessageComponents.js';

const applicationCommand = new ApplicationCommand(
    'cointoss',
    'Toss a coin, heads or tails. (Fun fact: there\'s a 1/6000 chance of a coin landing on its edge.)',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const execute = async function(interaction: any, env: any, args: string[]) {
    const interactionResponse = new InteractionResponse(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    let history = '';
    if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
        interactionResponse.setType(INTERACTION_RESPONSE_TYPE.UPDATE_MESSAGE);
        history = interaction.data.custom_id;
    }

    const avgEdgeAttempts = 6000;
    const randomInt = getRandomInt(0, avgEdgeAttempts * 2 - 1);
    let result: COIN_RESULT;
    let imgUrl: string;
    if (randomInt < avgEdgeAttempts - 1) {
        result = COIN_RESULT.HEADS;
        imgUrl = 'https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/cointoss_heads.png';
    }
    else if (randomInt < ((avgEdgeAttempts - 1) * 2)) {
        result = COIN_RESULT.TAILS;
        imgUrl = 'https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/cointoss_tails.png';
    }
    else {
        result = COIN_RESULT.EDGE;
        imgUrl = 'https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/cointoss_edge.PNG';
    }

    const embed = new Embed();
    embed.setTitle('Coin Toss');
    embed.setDescription(result);
    embed.image?.setUrl(imgUrl);
    history = `${history}${result[0]}`
    embed.footer?.setText(`History: ${history}`)
    interactionResponse.data?.addEmbed(embed);

    const button = new ButtonNonLink(history); // Passing data through custom_id
    button.setStyle(BUTTON_STYLE.PRIMARY);
    button.setLabel('Toss again');
    const actionRow = new ActionRow();
    actionRow.addComponent(button);
    interactionResponse.data?.addComponent(actionRow);

    return interactionResponse;
}

enum COIN_RESULT {
    HEADS = 'Heads',
    TAILS = 'Tails',
    EDGE =
        'Edge... wait what?\n' +
        '(Fun fact: [there\'s a 1/6000 chance of a coin landing on its edge.](https://journals.aps.org/pre/abstract/10.1103/PhysRevE.48.2547))',
}

/**
 * Coin Toss Command
 */
export const CoinToss = new Command(applicationCommand, execute);
