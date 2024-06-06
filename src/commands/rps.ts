import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE, BUTTON_STYLE, INTERACTION_RESPONSE_FLAGS, INTERACTION_RESPONSE_TYPE, INTERACTION_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse, MessageData } from '../templates/discord/InteractionResponse.js'
import { getRandomInt } from '../handlers/Utils.js';
import { ActionRow, ButtonNonLink } from '../templates/discord/MessageComponents.js';
import { isOriginalUserInvoked } from '../handlers/InteractionHandler.js';

const applicationCommand = new ApplicationCommand(
    'rps',
    'Play rock paper scissors with the bot',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const execute = async function(interaction: any, env: any, args: string[]) {
    const interactionResponse = new InteractionResponse(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE, new MessageData());

    if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
        if (!isOriginalUserInvoked(interaction)) {
            interactionResponse.data?.setContent('\`Error: You are not the original user who triggered the interaction. Please invoke a new slash command.\`');
            interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
            return interactionResponse;
        }
        interactionResponse.setType(INTERACTION_RESPONSE_TYPE.UPDATE_MESSAGE);
        const userChoice = interaction.data.custom_id;
        const botChoice = [RPS.ROCK, RPS.PAPER, RPS.SCISSORS][getRandomInt(0, 2)];
        const result = evaluateRps(userChoice, botChoice);
        const RpsToEmoji = {
            [RPS.ROCK]: ':rock:',
            [RPS.PAPER]: ':roll_of_paper:',
            [RPS.SCISSORS]: ':scissors:'
        }

        const embed = new Embed();
        embed.setTitle('Rock-Paper-Scissors');
        embed.addField('You chose', RpsToEmoji[userChoice], true);
        embed.addField('Bot chose', RpsToEmoji[botChoice], true);
        embed.addField('Result', result);
        interactionResponse.data?.addEmbed(embed);
    }
    
    const buttonRock = new ButtonNonLink(RPS.ROCK);
    const buttonPaper = new ButtonNonLink(RPS.PAPER);
    const buttonScissors = new ButtonNonLink(RPS.SCISSORS);
    buttonRock.setStyle(BUTTON_STYLE.PRIMARY);
    buttonPaper.setStyle(BUTTON_STYLE.SUCCESS);
    buttonScissors.setStyle(BUTTON_STYLE.DANGER);
    buttonRock.setLabel('Rock');
    buttonPaper.setLabel('Paper');
    buttonScissors.setLabel('Scissors');
    const actionRow = new ActionRow();
    actionRow.addComponent(buttonRock);
    actionRow.addComponent(buttonPaper);
    actionRow.addComponent(buttonScissors);
    interactionResponse.data?.addComponent(actionRow);

    return interactionResponse;
}

enum RPS {
    ROCK = 'rock',
    PAPER = 'paper',
    SCISSORS = 'scissors'
}

/**
 * Evaluate Rock-Paper-Scissors match and return result game state text.
 */
function evaluateRps(userChoice: RPS, botChoice: RPS) {
    const losesTo = {
        [RPS.ROCK]: RPS.SCISSORS,
        [RPS.PAPER]: RPS.ROCK,
        [RPS.SCISSORS]: RPS.PAPER
    }
    if (userChoice == losesTo[botChoice]) { return ':skull: _it\'s not very effective..._'; }
    else if (botChoice == losesTo[userChoice]) { return ':boom: _it\'s super effective!_'; }
    else { return ':zzz: _but nothing happened._'; }
}

/**
 * Rock paper scissors Command
 */
export const Rps = new Command(applicationCommand, execute);
