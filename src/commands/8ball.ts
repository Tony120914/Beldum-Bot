import { ApplicationCommand, ApplicationCommandOption } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_OPTION_TYPE, APPLICATION_COMMAND_TYPE, INTERACTION_CALLBACK_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { getRandomInt } from '../handlers/Utils.js';
import type { Interaction } from '../templates/discord/InteractionReceive.js';

const applicationCommand = new ApplicationCommand(
    '8ball',
    'Ask a yes/no question.',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const questionInputOption = new ApplicationCommandOption(
    'question',
    'A yes/no question.',
    APPLICATION_COMMAND_OPTION_TYPE.STRING
);
questionInputOption.setRequired(true);
applicationCommand.addOptions(questionInputOption);

const execute = async function(interaction: Interaction, env: Env, args: string[]) {
    const question = args[1];
    const answers = [
        // "Yes" answers
        ':white_check_mark: Oh yeah, 100%.',
        ':white_check_mark: Of course!',
        ':white_check_mark: Yes, obviously...',
        ':white_check_mark: Science says yes.',
        ':white_check_mark: Absolutely!',
        ':white_check_mark: Certainly.',
        ':white_check_mark: There\'s no doubt.',
        ':white_check_mark: Affirmative.',
        ':white_check_mark: Yes, indeed.',
        ':white_check_mark: Probably, yes.',

        // "Maybe" answers
        ':grey_question: ¯\\_(ツ)_/¯',
        ':grey_question: My crystal ball is foggy...',
        ':grey_question: Zzz...',
        ':grey_question: Huh? What? Pardon?',
        ':grey_question: I\'m busy right now. Ask me again later.',
    
        // "No" answers
        ':no_entry_sign: Hahaha. No.',
        ':no_entry_sign: Nah, in your dreams...',
        ':no_entry_sign: Nope. Nope. Nope. Nope. Nope.',
        ':no_entry_sign: Absolutely not.',
        ':no_entry_sign: Negative.',
        ];
    const randomIndex = getRandomInt(0, answers.length - 1);
    const answer = answers[randomIndex];

    const embed = new Embed();
    embed.setTitle('8ball');
    embed.setDescription(`:8ball: ${question}`);
    embed.addField('Answer', answer, true);
    
    const interactionResponse = new InteractionResponse(INTERACTION_CALLBACK_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    const data = interactionResponse.initMessageData();
    data.addEmbed(embed);

    return interactionResponse;
}

/**
 * 8ball Command
 */
const EightBall = new Command(applicationCommand, execute);
export default EightBall;

export const tests = {
    execute,
}
