import { ApplicationCommand, ApplicationCommandOption } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_OPTION_TYPE, APPLICATION_COMMAND_TYPE, BUTTON_STYLE, INTERACTION_CALLBACK_TYPE, INTERACTION_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { getRandomInt } from '../handlers/Utils.js';
import { ButtonNonLink, ActionRow } from '../templates/discord/MessageComponents.js';
import { isOriginalUserInvoked } from '../handlers/InteractionHandler.js';
import { ephemeralError } from '../handlers/ErrorHandler.js';
import type { Interaction } from '../templates/discord/InteractionReceive.js';

const applicationCommand = new ApplicationCommand(
    'rng',
    'Random number generator that rolls a random integer between two inputted integers (inclusive)',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const firstNumberInputOption = new ApplicationCommandOption(
    'int1',
    'First integer (inclusive)',
    APPLICATION_COMMAND_OPTION_TYPE.INTEGER
);
firstNumberInputOption.setRequired(true);
applicationCommand.addOptions(firstNumberInputOption);

const secondNumberInputOption = new ApplicationCommandOption(
    'int2',
    'Second integer (inclusive)',
    APPLICATION_COMMAND_OPTION_TYPE.INTEGER
);
secondNumberInputOption.setRequired(true);
applicationCommand.addOptions(secondNumberInputOption);

const execute = async function(interaction: Interaction, env: Env, args: string[]) {
    const interactionResponse = new InteractionResponse(INTERACTION_CALLBACK_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    let int1: number = 0;
    let int2: number = 0;
    if (interaction.type == INTERACTION_TYPE.APPLICATION_COMMAND) {
        // Using raw values instead of args to avoid converting
        const options = interaction.data?.options;
        if (!options || options.length < 2) { return ephemeralError(interactionResponse, 'Error: 🐛'); }
        int1 = options[0]!.value as number;
        int2 = options[1]!.value as number;
    }
    else if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
        if (!isOriginalUserInvoked(interaction)) {
            return ephemeralError(interactionResponse, 'Error: You are not the original user who triggered the interaction. Please invoke a new slash command.');
        }
        interactionResponse.setType(INTERACTION_CALLBACK_TYPE.UPDATE_MESSAGE);
        const custom = interaction.data?.custom_id;
        if (!custom) { return ephemeralError(interactionResponse, 'Error: 🐛'); }
        const customObj = JSON.parse(custom);
        int1 = customObj.int1;
        int2 = customObj.int2;
    }
    const min = Math.min(int1, int2);
    const max = Math.max(int1, int2);
    const randomInt = getRandomInt(min, max);

    const embed = new Embed();
    embed.setTitle('Random Number Generator');
    embed.setDescription(`:game_die: Between ${min} and ${max} (both inclusive)`);
    embed.addField('Result', randomInt.toString());
    const data = interactionResponse.initMessageData();
    data.addEmbed(embed);

    const custom = {"int1": int1, "int2": int2};
    const button = new ButtonNonLink(JSON.stringify(custom), BUTTON_STYLE.PRIMARY); // Passing data through custom_id
    button.setLabel('Roll again');
    button.setEmoji(undefined, '🔁');
    const actionRow = new ActionRow();
    actionRow.addComponent(button);
    data.addComponent(actionRow);

    return interactionResponse;
}

/**
 * RNG Command
 */
const Rng = new Command(applicationCommand, execute);
export default Rng;

export const tests = {
    execute,
}
