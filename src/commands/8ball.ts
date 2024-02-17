import { ApplicationCommand, ApplicationCommandOption } from '../discord_templates/ApplicationCommand.js'
import { Command } from '../app_templates/CommandHandler.js';
import { APPLICATION_COMMAND_OPTION_TYPE, APPLICATION_COMMAND_TYPE, INTERACTION_RESPONSE_TYPE } from '../discord_templates/Enums.js';
import { Embed } from '../discord_templates/Embed.js';
import { InteractionResponse } from '../discord_templates/InteractionResponse.js'
import { getRandomInt } from '../utils.js';

const applicationCommand = new ApplicationCommand(
    '8ball',
    'Ask a yes/no question.',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);
const option = new ApplicationCommandOption(
    'question',
    'a yes/no question.',
    APPLICATION_COMMAND_OPTION_TYPE.STRING
);
option.setRequired(true);
applicationCommand.addOptions(option);

const execute = async function(interaction: any, env: any) {
    const question = interaction.data.options[0].value;
    const answers = [
        // Yes - answers
        ':white_check_mark: Oh yeah, 100%.',
        ':white_check_mark: Of course!',
        ':white_check_mark: Yes, obviously...',
        ':white_check_mark: Science says yes.',
        ':white_check_mark: Absolutely!',
        ':white_check_mark: Certainly.',
        ':white_check_mark: There\'s no doubt.',
        ':white_check_mark: Yeee...n...ye...n...YES.',
        ':white_check_mark: Yes, indeed.',
        ':white_check_mark: Probably, yes.',

        // Maybe - answers
        ':grey_question: ¯\\_(ツ)_/¯',
        ':grey_question: My crystal ball is foggy...',
        ':grey_question: Zzz...',
        ':grey_question: Huh? What?',
        ':grey_question: I\'m busy right now. Ask me again later.',
    
        // No - answers
        ':no_entry_sign: Hahaha. No.',
        ':no_entry_sign: Nah, in your dreams...',
        ':no_entry_sign: Nope. Nope. Nope. Nope. Nope.',
        ':no_entry_sign: Absolutely not.',
        ':no_entry_sign: Science says no.',
        ];
    const randomInt = getRandomInt(0, answers.length - 1);

    const embed = new Embed();
    embed.setTitle('8ball');
    embed.addField(`Question: ${question}`,answers[randomInt]);
    
    const interactionResponse = new InteractionResponse(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    interactionResponse.data?.addEmbed(embed);

    return interactionResponse;
}

/**
 * 8ball Command
 */
export const EightBall = new Command(applicationCommand, execute);
