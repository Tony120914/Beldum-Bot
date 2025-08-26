import { ApplicationCommand, ApplicationCommandOption } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_OPTION_TYPE, APPLICATION_COMMAND_TYPE, INTERACTION_RESPONSE_FLAGS, INTERACTION_CALLBACK_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse, MessageData } from '../templates/discord/InteractionResponse.js'
import { ephemeralError, getFetchErrorText } from '../handlers/ErrorHandler.js';

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

const execute = async function(interaction: any, env: any, args: string[]) {
    const interactionResponse = new InteractionResponse(INTERACTION_CALLBACK_TYPE.CHANNEL_MESSAGE_WITH_SOURCE, new MessageData());
    const keywords = args[1];
    if (!keywords) { return ephemeralError(interactionResponse, 'Error: Empty or invalid keywords.'); }
    const url = `http://api.urbandictionary.com/v0/define?term=${encodeURI(keywords)}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': env.USER_AGENT
        }
    });
    if (!response.ok) {
        const error = await getFetchErrorText(response);
        return ephemeralError(interactionResponse, 'Error: Something went wrong. Please try again later.', error);
    }
    const data: UrbanDictionaryList = await response.json();
    if (!data || !data.list || !Array.isArray(data.list) || !data.list[0]) {
        return ephemeralError(interactionResponse, 'Urban Dictionary has no results for: ${keywords}');
    }
    const definition: UrbanDictionaryDefinition = data.list[0];
    
    const embed = new Embed();
    embed.setTitle('Urban Dictionary');
    embed.addField('Search result', `[${definition.word}](${definition.permalink})`);
    embed.addField('Top definition', definition.definition);
    embed.addField('Example', definition.example);
    embed.addField(':thumbsup:', definition.thumbs_up?.toString(), true);
    embed.addField(':thumbsdown:', definition.thumbs_down?.toString(), true);
    if (definition.author) { embed.addField('Written by', `[${definition.author}](https://www.urbandictionary.com/author.php?author=${encodeURI(definition.author)})`, true); }
    if (definition.written_on) { embed.initFooter(`Date posted: ${new Date(definition.written_on).toString()}`); }
    embed.thumbnail?.setUrl('https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/assets/urbandictionary.png');
    interactionResponse.data?.addEmbed(embed);

    return interactionResponse;
}

class UrbanDictionaryList {
    list?: UrbanDictionaryDefinition[]
}

/**
 * Urban Dictionary definition structure.
 */
class UrbanDictionaryDefinition {
    defid?: number
    definition?: string
    permalink?: string
    thumbs_up?: number
    thumbs_down?: number
    author?: string
    word?: string
    written_on?: string
    example?: string
    current_vote?: string // deprecated?
}

/**
 * Urban Dictionary Command
 */
export const UrbanDictionary = new Command(applicationCommand, execute);
