import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE, INTERACTION_RESPONSE_FLAGS, INTERACTION_RESPONSE_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse, MessageData } from '../templates/discord/InteractionResponse.js'
import { ActionRow, ButtonLink } from '../templates/discord/MessageComponents.js';
import { ephemeralError } from '../handlers/ErrorHandler.js';

const applicationCommand = new ApplicationCommand(
    'Spongebob Mock',
    '',
    APPLICATION_COMMAND_TYPE.MESSAGE
);

const execute = async function(interaction: any, env: any, args: string[]) {
    const interactionResponse = new InteractionResponse(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE, new MessageData());
    const guildId = interaction.guild_id;
    const channelId = interaction.channel_id;
    const messageId = interaction.data.target_id;
    const message = interaction.data.resolved.messages[messageId];
    const messageText = message.content;
    const messageUrl = `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
    if (messageText.length < 2) {
        return ephemeralError(interactionResponse, mockText('Error: The selected message is too short to mock.'));
    }

    const embed = new Embed();
    embed.setDescription(mockText(messageText));
    embed.thumbnail?.setUrl('https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/spongebobmock.png');
    interactionResponse.data?.addEmbed(embed);

    const actionRow = new ActionRow();
    const button = new ButtonLink(messageUrl);
    button.setLabel('Original message');
    actionRow.addComponent(button);
    interactionResponse.data?.addComponent(actionRow);

    return interactionResponse;
}

/**
 * Spongebob mocks the text.
 * (Alternating between lower-case and upper-case.)
 */
function mockText(text: string) {
    enum CASE {
        LOWER,
        UPPER
    }
    let mockedText = '';
    let currentCase = CASE.LOWER;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (isAlpha(char) && currentCase == CASE.LOWER) {
            mockedText += char.toLowerCase();
            currentCase = CASE.UPPER;
        }
        else if (isAlpha(char) && currentCase == CASE.UPPER) {
            mockedText += char.toUpperCase();
            currentCase = CASE.LOWER;
        }
        else {
            mockedText += char;
        }
    }
    return mockedText;
}

/**
 * Checks if the single character is a part of the alphabet.
 */
function isAlpha(char: string) {
    if (char.length != 1) {
        console.error('\"char\" must be 1 character long.');
        return;
    }
    return /[a-zA-Z]/u.test(char);
}

/**
 * Spongebob Mock Command
 */
export const SpongebobMock = new Command(applicationCommand, execute);
