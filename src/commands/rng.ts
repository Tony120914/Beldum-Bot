import { ApplicationCommand, ApplicationCommandOption } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_OPTION_TYPE, APPLICATION_COMMAND_TYPE, INTERACTION_RESPONSE_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { getRandomInt } from '../handlers/Utils.js';

const applicationCommand = new ApplicationCommand(
    'rng',
    'Random number generator that rolls a random integer between two inputted integers (inclusive)',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const FirstNumberInputOption = new ApplicationCommandOption(
    'int1',
    'First integer (inclusive)',
    APPLICATION_COMMAND_OPTION_TYPE.INTEGER
);
FirstNumberInputOption.setRequired(true);
applicationCommand.addOptions(FirstNumberInputOption);

const SecondNumberInputOption = new ApplicationCommandOption(
    'int2',
    'Second integer (inclusive)',
    APPLICATION_COMMAND_OPTION_TYPE.INTEGER
);
SecondNumberInputOption.setRequired(true);
applicationCommand.addOptions(SecondNumberInputOption);

const execute = async function(interaction: any, env: any, args: string[]) {
    const int1 = interaction.data.options[0].value; // using raw value instead of args to avoid converting
    const int2 = interaction.data.options[1].value; // using raw value instead of args to avoid converting
    const randomInt = getRandomInt(Math.min(int1, int2), Math.max(int1, int2));

    const embed = new Embed();
    embed.setTitle('Random Number Generator');
    embed.setDescription(`Between ${int1} and ${int2} (both inclusive)`);
    embed.addField('Result', randomInt.toString());
    
    const interactionResponse = new InteractionResponse(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    interactionResponse.data?.addEmbed(embed);

    return interactionResponse;
}

/**
 * RNG Command
 */
export const Rng = new Command(applicationCommand, execute);
