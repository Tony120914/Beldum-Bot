import { ApplicationCommand, ApplicationCommandOption } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_OPTION_TYPE, APPLICATION_COMMAND_TYPE, BUTTON_STYLE, INTERACTION_RESPONSE_TYPE, INTERACTION_TYPE, TEXT_INPUT_STYLE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { getRandomInt } from '../handlers/Utils.js';
import { ActionRow, ButtonNonLink, TextInput } from '../templates/discord/MessageComponents.js';

const applicationCommand = new ApplicationCommand(
    'rps',
    'Play rock paper scissors with the bot',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const execute = async function(interaction: any, env: any, args: string[]) {
    const interactionResponse = new InteractionResponse(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);

    const buttonRock = new ButtonNonLink('rock');
    const buttonPaper = new ButtonNonLink('paper');
    const buttonScissors = new ButtonNonLink('scissors');
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

    if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
        const userChoice = interaction.data.custom_id;
        const botChoice = [RPS_CHOICE.ROCK, RPS_CHOICE.PAPER, RPS_CHOICE.SCISSORS][getRandomInt(0, 2)];
        const result = evaluateRps(userChoice, botChoice);
        const RpsToEmoji = {
            [RPS_CHOICE.ROCK]: ':rock:',
            [RPS_CHOICE.PAPER]: ':roll_of_paper:',
            [RPS_CHOICE.SCISSORS]: ':scissors:'
        }

        const embed = new Embed();
        embed.setTitle('Rock-Paper-Scissors');
        embed.addField('You chose', RpsToEmoji[userChoice], true);
        embed.addField('Bot chose', RpsToEmoji[botChoice], true);
        embed.addField('Result', result);
        interactionResponse.data?.addEmbed(embed);
        interactionResponse.setType(INTERACTION_RESPONSE_TYPE.UPDATE_MESSAGE);
    }

    return interactionResponse;
}

enum RPS_CHOICE {
    ROCK = 'rock',
    PAPER = 'paper',
    SCISSORS = 'scissors'
}

function evaluateRps(userChoice: RPS_CHOICE, botChoice: RPS_CHOICE) {
    const losesTo = {
        [RPS_CHOICE.ROCK]: RPS_CHOICE.SCISSORS,
        [RPS_CHOICE.PAPER]: RPS_CHOICE.ROCK,
        [RPS_CHOICE.SCISSORS]: RPS_CHOICE.PAPER
    }
    if (userChoice == losesTo[botChoice]) { return ':skull: _it\'s not very effective..._'; }
    else if (botChoice == losesTo[userChoice]) { return ':boom: _it\'s super effective!_'; }
    else { return ':zzz: _but nothing happened._'; }
}

/**
 * Rock paper scissors Command
 */
export const Rps = new Command(applicationCommand, execute);
