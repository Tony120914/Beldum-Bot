import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE, INTERACTION_CALLBACK_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { ActionRow, ButtonLink } from '../templates/discord/MessageComponents.js';
import { ephemeralError } from '../handlers/ErrorHandler.js';
import type { Interaction } from '../templates/discord/InteractionReceive.js';

const applicationCommand = new ApplicationCommand(
    'Spongebob Mock',
    '',
    APPLICATION_COMMAND_TYPE.MESSAGE
);

const execute = async function(interaction: Interaction, env: Env, args: string[]) {
    const interactionResponse = new InteractionResponse(INTERACTION_CALLBACK_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    const data = interactionResponse.initMessageData();
    const interactionData = interaction.data;
    if (!interactionData || !interactionData.target_id || !interactionData.resolved || !interactionData.resolved.messages) {
        return ephemeralError(interactionResponse, mockText('Error: 🐛'));
    }
    const guildId = interaction.guild_id ? interaction.guild_id : '@me';
    const channelId = interaction.channel_id;
    const messageId = interactionData.target_id;
    const message = interactionData.resolved.messages[messageId];
    const messageText = message?.content;
    const messageUrl = `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
    if (!messageText || messageText.length < 2) {
        return ephemeralError(interactionResponse, mockText('Error: The selected message is too short to mock.'));
    }

    const embed = new Embed();
    embed.setDescription(mockText(messageText));
    embed.initThumbnail('https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/assets/spongebobmock.png');
    data.addEmbed(embed);

    const actionRow = new ActionRow();
    const button = new ButtonLink(messageUrl);
    button.setLabel('Jump to original message');
    actionRow.addComponent(button);
    data.addComponent(actionRow);

    return interactionResponse;
}

/**
 * Spongebob mocks the text.
 * (Alternating between lower-case and upper-case.)
 */
function mockText(text: string): string {
    enum CASE {
        LOWER,
        UPPER
    }
    let mockedText = '';
    let currentCase = CASE.LOWER;
    for (const char of text) {
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
const SpongebobMock = new Command(applicationCommand, execute);
export default SpongebobMock;
