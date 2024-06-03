import { ApplicationCommand, ApplicationCommandOption } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_OPTION_TYPE, APPLICATION_COMMAND_TYPE, INTERACTION_RESPONSE_FLAGS, INTERACTION_RESPONSE_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { getFetchErrorText } from '../handlers/ErrorHandler.js';

const applicationCommand = new ApplicationCommand(
    'urbandictionary',
    'Search for an Urban Dictionary definition (it will return the top result)',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);
const keywordInputOption = new ApplicationCommandOption(
    'keywords',
    'Keywords to search for',
    APPLICATION_COMMAND_OPTION_TYPE.STRING
);
keywordInputOption.setRequired(true);
applicationCommand.addOptions(keywordInputOption);

const execute = async function(interaction: object, env: any, args: string[]) {
    const interactionResponse = new InteractionResponse(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    const keywords = args[1];
    const url = `http://api.urbandictionary.com/v0/define?term=${encodeURI(keywords)}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': env.USER_AGENT
        }
    });
    if (!response.ok) {
        const error = await getFetchErrorText(response);
        console.error(error);
        interactionResponse.data?.setContent('Error: Something went wrong. Please try again later.');
        interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
        return interactionResponse;
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.list) || data.list.length == 0) {
        interactionResponse.data?.setContent(`Urban Dictionary has no results for: ${keywords}`);
        interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
        return interactionResponse;
    }
    const definition = new UrbanDictionaryDefinition();
    definition.assignObject(data.list[0]);
    
    const embed = new Embed();
    embed.setTitle('Urban Dictionary');
    embed.addField('Search result', `[${definition.word}](${definition.permalink})`);
    embed.addField('Top definition', definition.definition);
    embed.addField('Example', definition.example);
    embed.addField(':thumbsup:', definition.thumbs_up.toString(), true);
    embed.addField(':thumbsdown:', definition.thumbs_down.toString(), true);
    embed.addField('Written by', `[${definition.author}](https://www.urbandictionary.com/author.php?author=${encodeURI(definition.author)})`, true);
    embed.footer?.setText(`Date posted: ${new Date(definition.written_on).toString()}`);
    embed.thumbnail?.setUrl('https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/images/urbandictionary.png');
    interactionResponse.data?.addEmbed(embed);

    return interactionResponse;
}

/**
 * Urban Dictionary structure.
 */
class UrbanDictionaryDefinition {
    defid: number
    definition: string
    permalink: string
    thumbs_up: number
    thumbs_down: number
    author: string
    word: string
    written_on: string
    example: string
    current_vote: string // deprecated?

    assignObject(object: object) {
        Object.assign(this, object);
    }
}

/**
 * Urban Dictionary Command
 */
export const UrbanDictionary = new Command(applicationCommand, execute);
