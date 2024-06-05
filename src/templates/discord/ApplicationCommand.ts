import {
    APPLICATION_COMMAND_OPTION_TYPE,
    APPLICATION_COMMAND_TYPE,
    CHANNEL_TYPE
} from "./Enums";

const APPLICATION_COMMAND_NAME_LIMIT_MIN = 1;
const APPLICATION_COMMAND_NAME_LIMIT_MAX = 32;
const APPLICATION_COMMAND_DESCRIPTION_LIMIT_MIN = 1;
const APPLICATION_COMMAND_DESCRIPTION_LIMIT_MAX = 100;
/**
 * Application Command structure
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object
 */
export class ApplicationCommand {
    name: string
    // name_localizations?: Dictionary with keys in available locales
    description?: string
    // description_localizations?: Dictionary with withs in available locales
    options?: ApplicationCommandOption[] = [];
    default_member_permissions?: string
    dm_permission?: boolean = true;
    // default_permissions?: boolean = true; // will be deprecated in the future
    type?: APPLICATION_COMMAND_TYPE = APPLICATION_COMMAND_TYPE.CHAT_INPUT;
    nsfw?: boolean

    constructor(name: string, description: string, type: APPLICATION_COMMAND_TYPE) {
        if (!(APPLICATION_COMMAND_NAME_LIMIT_MIN <= name.length && name.length <= APPLICATION_COMMAND_NAME_LIMIT_MAX)) {
            console.error(
                `The condition must be met: ${APPLICATION_COMMAND_NAME_LIMIT_MIN} <= name <= ${APPLICATION_COMMAND_NAME_LIMIT_MAX} in application command.\n` +
                `${JSON.stringify(name)}`);
            return;
        }
        if (type == APPLICATION_COMMAND_TYPE.CHAT_INPUT && !(APPLICATION_COMMAND_DESCRIPTION_LIMIT_MIN <= description.length && description.length <= APPLICATION_COMMAND_DESCRIPTION_LIMIT_MAX)) {
            console.error(
                `The condition must be met (chat input): ${APPLICATION_COMMAND_DESCRIPTION_LIMIT_MIN} <= description <= ${APPLICATION_COMMAND_DESCRIPTION_LIMIT_MAX} in application command.\n` +
                `${JSON.stringify(description)}`);
            return;
        }
        if (type == APPLICATION_COMMAND_TYPE.CHAT_INPUT && !/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u.test(name)) {
            console.error(
                `Application command (chat input) name must match regex:/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u\n` +
                `${JSON.stringify(name)}`);
            return;
        }
        if ((type == APPLICATION_COMMAND_TYPE.MESSAGE || type == APPLICATION_COMMAND_TYPE.USER) && description != '') {
            console.error(
                `Application command (message/user) description must be an empty string\n` +
                `${JSON.stringify(description)}`);
            return;
        }
        this.name = name;
        this.description = description;
        this.type = type;
    }

    addOptions(option: ApplicationCommandOption) { this.options?.push(option); }
    setDefaultMemberPermissions(default_member_permissions: string) { this.default_member_permissions = default_member_permissions; }
    setDmPermission(isAllowed: boolean) { this.dm_permission = isAllowed; }
    setNsfw(isNsfw: boolean) { this.nsfw = isNsfw; }
}

const APPLICATION_COMMAND_OPTION_NAME_LIMIT_MIN = 1;
const APPLICATION_COMMAND_OPTION_NAME_LIMIT_MAX = 32;
const APPLICATION_COMMAND_OPTION_DESCRIPTION_LIMIT_MIN = 1;
const APPLICATION_COMMAND_OPTION_DESCRIPTION_LIMIT_MAX = 100;
const APPLICATION_COMMAND_OPTION_MIN_LENGTH = 0; // Max Length is min 1 (add 1)
const APPLICATION_COMMAND_OPTION_MAX_LENGTH = 6000;
/**
 * Application Command Option structure
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
 */
export class ApplicationCommandOption {
    type: APPLICATION_COMMAND_OPTION_TYPE
    name: string
    // name_localizations?: Dictionary with keys in available locales
    description: string
    // description_localizations?: Dictionary with withs in available locales
    required?: boolean = false;
    choices?: ApplicationCommandOptionChoice[] = [];
    options?: ApplicationCommandOption[] = [];
    channel_types?: CHANNEL_TYPE[] = [];
    min_value?: number
    max_value?: number
    min_length?: number
    max_length?: number
    autocomplete?: boolean

    constructor(name: string, description: string, type: APPLICATION_COMMAND_OPTION_TYPE, ) {
        if (!(APPLICATION_COMMAND_OPTION_NAME_LIMIT_MIN <= name.length && name.length <= APPLICATION_COMMAND_OPTION_NAME_LIMIT_MAX)) {
            console.error(
                `The condition must be met: ${APPLICATION_COMMAND_OPTION_NAME_LIMIT_MIN} <= name <= ${APPLICATION_COMMAND_OPTION_NAME_LIMIT_MAX} in application command.\n` +
                `${JSON.stringify(name)}`);
            return;
        }
        if (!(APPLICATION_COMMAND_OPTION_DESCRIPTION_LIMIT_MIN <= description.length && description.length <= APPLICATION_COMMAND_OPTION_DESCRIPTION_LIMIT_MAX)) {
            console.error(
                `The condition must be met: ${APPLICATION_COMMAND_OPTION_DESCRIPTION_LIMIT_MIN} <= description <= ${APPLICATION_COMMAND_OPTION_DESCRIPTION_LIMIT_MAX} in application command.\n` +
                `${JSON.stringify(description)}`);
            return;
        }
        if (!/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u.test(name)) {
            console.error(
                `Application command name must match regex:/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u\n` +
                `${JSON.stringify(name)}`);
            return;
        }
        this.name = name;
        this.description = description;
        this.type = type;
    }

    setRequired(isRequired: boolean) { this.required = isRequired; }
    addChoice(name: string, value: string|number) {
        const choice = new ApplicationCommandOptionChoice(name, value);
        this.choices?.push(choice);
    }
    addOption(options: ApplicationCommandOption) { this.options?.push(options); }
    addChannelType(channelType: CHANNEL_TYPE) { this.channel_types?.push(channelType); }
    setMinValue(minValue: number) { this.min_value = minValue; }
    setMaxValue(maxValue: number) { this.max_value = maxValue; }
    setMinLength(minLength: number) {
        if (!(APPLICATION_COMMAND_OPTION_MIN_LENGTH <= minLength && minLength <= APPLICATION_COMMAND_OPTION_MAX_LENGTH)) {
            console.error(
                `The condition must be met: ${APPLICATION_COMMAND_OPTION_MIN_LENGTH} <= minLength <= ${APPLICATION_COMMAND_OPTION_MAX_LENGTH} in application command option.\n` +
                `${JSON.stringify(minLength)}`);
            return;
        }
        this.min_length = minLength;
    }
    setMaxLength(maxLength: number) {
        if (!(APPLICATION_COMMAND_OPTION_MIN_LENGTH <= maxLength && maxLength <= APPLICATION_COMMAND_OPTION_MAX_LENGTH)) {
            console.error(
                `The condition must be met: ${APPLICATION_COMMAND_OPTION_MIN_LENGTH} <= maxLength <= ${APPLICATION_COMMAND_OPTION_MAX_LENGTH} in application command option.\n` +
                `${JSON.stringify(maxLength)}`);
            return;
        }
        this.max_length = maxLength;
    }
    setAutocomplete(isAutoComplete: boolean) { this.autocomplete = isAutoComplete; }
}

const APPLICATION_COMMAND_OPTION_CHOICE_NAME_LIMIT_MIN = 1;
const APPLICATION_COMMAND_OPTION_CHOICE_NAME_LIMIT_MAX = 100;
const APPLICATION_COMMAND_OPTION_CHOICE_DESCRIPTION_LIMIT = 100;
/**
 * Application Command Option Choice structure
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure
 */
class ApplicationCommandOptionChoice {
    name: string
    // name_localizations?: Dictionary with keys in available locales
    value: string|number

    constructor(name: string, value: string|number) {
        if (!(APPLICATION_COMMAND_OPTION_CHOICE_NAME_LIMIT_MIN <= name.length && name.length <= APPLICATION_COMMAND_OPTION_CHOICE_NAME_LIMIT_MAX)) {
            console.error(
                `The condition must be met: ${APPLICATION_COMMAND_OPTION_CHOICE_NAME_LIMIT_MIN} <= name <= ${APPLICATION_COMMAND_OPTION_CHOICE_NAME_LIMIT_MAX} in application command.\n` +
                `${JSON.stringify(name)}`);
            return;
        }
        if (typeof(value) == 'string') {
            if (value.length >= APPLICATION_COMMAND_OPTION_CHOICE_DESCRIPTION_LIMIT) {
                console.error(
                    `Attempted to exceed limit of ${APPLICATION_COMMAND_OPTION_CHOICE_DESCRIPTION_LIMIT} characters in application command option choice value.\n` +
                    `${JSON.stringify(value)}`);
            }
            this.value = value.slice(0, APPLICATION_COMMAND_OPTION_CHOICE_DESCRIPTION_LIMIT);
        }
        this.name = name;
        this.value = value;
    }
}
