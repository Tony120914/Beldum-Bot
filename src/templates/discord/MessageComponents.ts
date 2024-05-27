import {
    BUTTON_STYLE,
    CHANNEL_TYPE,
    DEFAULT_VALUE_TYPE,
    MESSAGE_COMPONENT_TYPE,
    TEXT_INPUT_STYLE,
} from "./Enums";
import { Emoji } from "./EmojiResources"

/**
 * Parent structure for all 8 Message Components.
 * Belongs to Interaction Response's data.
 * https://discord.com/developers/docs/interactions/message-components
 */
export abstract class MessageComponent {
    type: MESSAGE_COMPONENT_TYPE
}

const ACTION_ROW_BUTTON_LIMIT = 5;
const ACTION_ROW_SELECT_MENU_LIMIT = 1;
/**
 * Non-interactive container component for other types of components.
 * https://discord.com/developers/docs/interactions/message-components#action-rows
 */
export class ActionRow extends MessageComponent {
    type: MESSAGE_COMPONENT_TYPE = MESSAGE_COMPONENT_TYPE.ACTION_ROW;
    components: MessageComponent[] = [];

    #buttonCount: number = 0;
    #selectMenuCount: number = 0;

    addComponent(component: MessageComponent) {
        switch (component.type) {
            case MESSAGE_COMPONENT_TYPE.ACTION_ROW: {
                console.error(
                    `Action Rows cannot contain another Action Row.\n` +
                    `${JSON.stringify(component)}`);
                return;
            }
            case MESSAGE_COMPONENT_TYPE.BUTTON: {
                if (this.#buttonCount >= ACTION_ROW_BUTTON_LIMIT) {
                    console.error(
                        `Action Rows cannot contain more than ${ACTION_ROW_BUTTON_LIMIT} buttons.\n` +
                        `${JSON.stringify(component)}`);
                    return;
                }
                if (this.#selectMenuCount > 0) {
                    console.error(
                        `Action Rows cannot contain both buttons and select menu components.\n` +
                        `${JSON.stringify(component)}`);                
                    return;
                }
                this.#buttonCount+=1;
                break;
            }
            case MESSAGE_COMPONENT_TYPE.STRING_SELECT:
            case MESSAGE_COMPONENT_TYPE.USER_SELECT:
            case MESSAGE_COMPONENT_TYPE.ROLE_SELECT:
            case MESSAGE_COMPONENT_TYPE.MENTIONABLE_SELECT:
            case MESSAGE_COMPONENT_TYPE.CHANNEL_SELECT: {
                if (this.#selectMenuCount >= ACTION_ROW_SELECT_MENU_LIMIT) {
                    console.error(
                        `Action Rows cannot contain more than ${ACTION_ROW_SELECT_MENU_LIMIT} select menu.\n` +
                        `${JSON.stringify(component)}`);
                    return;
                }
                if (this.#buttonCount > 0) {
                    console.error(
                        `Action Rows cannot contain both buttons and select menu components.\n` +
                        `${JSON.stringify(component)}`);
                    return;
                }
                this.#selectMenuCount+=1;
                break;
            }
            case MESSAGE_COMPONENT_TYPE.TEXT_INPUT: {
                break;
            }
            default: {
                console.error(
                    `Invalid Component type.\n` +
                    `${JSON.stringify(component)}`);
                return;
            }
        }
        this.components.push(component);
    }
}

const BUTTON_LABEL_LIMIT = 80;
const BUTTON_CUSTOM_ID_LIMIT = 100;
/**
 * Parent structure for all 5 types of interactive button components.
 * https://discord.com/developers/docs/interactions/message-components#buttons
 */
abstract class Button extends MessageComponent {
    type: MESSAGE_COMPONENT_TYPE = MESSAGE_COMPONENT_TYPE.BUTTON;
    style: BUTTON_STYLE
    label?: string
    emoji?: Emoji // Partial Emoji
    custom_id?: string
    url?: string
    disabled?: boolean = false;

    setLabel(label: string) {
        if (label.length >= BUTTON_LABEL_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${BUTTON_LABEL_LIMIT} characters in button label.\n` +
                `${JSON.stringify(label)}`);
        }
        this.label = label.slice(0, BUTTON_LABEL_LIMIT);
    }
    setEmoji(id: string, name: string, animated: boolean) {
        const emoji = new Emoji(id, name);
        emoji.setAnimated(animated);
        this.emoji = emoji;
    }
    setDisabled(isDisabled: boolean) { this.disabled = isDisabled; }
}

/**
 * Interactive non-link button component.
 * https://discord.com/developers/docs/interactions/message-components#buttons
 */
export class ButtonNonLink extends Button {
    constructor(custom_id: string) {
        super();
        if (custom_id.length >= BUTTON_CUSTOM_ID_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${BUTTON_CUSTOM_ID_LIMIT} characters in button custom id.\n` +
                `${JSON.stringify(custom_id)}`);
        }
        this.custom_id = custom_id.slice(0, BUTTON_CUSTOM_ID_LIMIT);
        this.url = undefined;
    }

    setStyle(style: BUTTON_STYLE) {
        if (style == BUTTON_STYLE.LINK) {
            console.error(
                `ButtonNonLink cannot be a Link Button. Use ButtonLink instead.\n` +
                `${JSON.stringify(style)}`);
            return;
        }
        this.style = style;
    }
}

/**
 * Interactive link button component.
 * https://discord.com/developers/docs/interactions/message-components#buttons
 */
export class ButtonLink extends Button {
    style: BUTTON_STYLE = BUTTON_STYLE.LINK;

    constructor(url: string) {
        super();
        this.url = url;
        this.custom_id = undefined;
    }
}

const SELECT_MENU_CUSTOM_ID_LIMIT = 100;
const SELECT_MENU_PLACEHOLDER_LIMIT = 150;
const SELECT_MENU_MIN_VALUES_LIMIT = 0;
const SELECT_MENU_MAX_VALUES_LIMIT = 25;
/**
 * Parent structure for all 5 select menu components.
 * https://discord.com/developers/docs/interactions/message-components#select-menus
 */
abstract class SelectMenu extends MessageComponent {
    type: MESSAGE_COMPONENT_TYPE
    custom_id: string
    placeholder?: string
    default_values?: DefaultValue[] = []
    min_values?: number = 1;
    max_values?: number = 1;
    disabled?: boolean = false;

    constructor(custom_id: string) {
        super();
        if (custom_id.length >= SELECT_MENU_CUSTOM_ID_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${SELECT_MENU_CUSTOM_ID_LIMIT} characters in select menu custom id.\n` +
                `${JSON.stringify(custom_id)}`);
        }
        this.custom_id = custom_id.slice(0, SELECT_MENU_CUSTOM_ID_LIMIT);
    }

    setPlaceholder(placeholder: string) {
        if (placeholder.length >= SELECT_MENU_PLACEHOLDER_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${SELECT_MENU_PLACEHOLDER_LIMIT} characters in select menu placeholder.\n` +
                `${JSON.stringify(placeholder)}`);
        }
        this.placeholder = placeholder.slice(0, SELECT_MENU_PLACEHOLDER_LIMIT);
    }
    addDefaultValue(id: string, type: DEFAULT_VALUE_TYPE) {
        const defaultValue = new DefaultValue(id, type);
        this.default_values?.push(defaultValue);
    }
    setMinValues(minValues: number) {
        if (!(SELECT_MENU_MIN_VALUES_LIMIT <= minValues && minValues <= SELECT_MENU_MAX_VALUES_LIMIT)) {
            console.error(
                `The condition must be met: ${SELECT_MENU_MIN_VALUES_LIMIT} <= min_values <= ${SELECT_MENU_MAX_VALUES_LIMIT} in select menu.\n` +
                `${JSON.stringify(minValues)}`);
            return;
        }
        this.min_values = minValues;
    }
    setMaxValues(maxValues: number) {
        if (!(SELECT_MENU_MIN_VALUES_LIMIT <= maxValues && maxValues <= SELECT_MENU_MAX_VALUES_LIMIT)) {
            console.error(
                `The condition must be met: ${SELECT_MENU_MIN_VALUES_LIMIT} <= max_values <= ${SELECT_MENU_MAX_VALUES_LIMIT} in select menu.\n` +
                `${JSON.stringify(maxValues)}`);
            return;
        }
        this.max_values = maxValues;
    }
    setDisabled(isDisabled: boolean) { this.disabled = isDisabled; }
}

/** 
 * Auto-populated select menu components.
 * https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-default-value-structure
 */
class DefaultValue {
    id: string
    type: DEFAULT_VALUE_TYPE

    constructor(id: string, type: DEFAULT_VALUE_TYPE) {
        this.id = id;
        this.type = type;
    }
}

const STRING_SELECT_OPTIONS_LIMIT = 25;
/**
 * Select menu for strings.
 * https://discord.com/developers/docs/interactions/message-components#select-menu-object
 */
export class StringSelect extends SelectMenu {
    type: MESSAGE_COMPONENT_TYPE = MESSAGE_COMPONENT_TYPE.STRING_SELECT;
    options?: StringSelectOption[] = [];

    addOption(option: StringSelectOption) {
        if (!this.options) { return; }
        if (this.options.length >= STRING_SELECT_OPTIONS_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${STRING_SELECT_OPTIONS_LIMIT} options in string select.\n` +
                `${JSON.stringify(option)}`);
        }
        this.options.push(option);
    }
}

const STRING_SELECT_OPTION_LABEL_LIMIT = 100;
const STRING_SELECT_OPTION_VALUE_LIMIT = 100;
const STRING_SELECT_OPTION_DESCRIPTION_LIMIT = 100;
/**
 * String Select options.
 * https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure
 */
export class StringSelectOption {
    label: string
    value: string
    description?: string
    emoji?: Emoji // Partial Emoji
    default?: boolean

    constructor(label: string, value: string) {
        if (label.length >= STRING_SELECT_OPTION_LABEL_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${STRING_SELECT_OPTION_LABEL_LIMIT} characters in string select option label.\n` +
                `${JSON.stringify(label)}`);
        }
        if (value.length >= STRING_SELECT_OPTION_VALUE_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${STRING_SELECT_OPTION_VALUE_LIMIT} characters in string select option value.\n` +
                `${JSON.stringify(value)}`);
        }
        this.label = label.slice(0, STRING_SELECT_OPTION_LABEL_LIMIT);
        this.value = value.slice(0, STRING_SELECT_OPTION_VALUE_LIMIT);
    }

    setDescription(description?: string) {
        if (!description) { return; }
        if (description.length >= STRING_SELECT_OPTION_DESCRIPTION_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${STRING_SELECT_OPTION_DESCRIPTION_LIMIT} characters in string select option description.\n` +
                `${JSON.stringify(description)}`);
        }
        this.description = description.slice(0, STRING_SELECT_OPTION_DESCRIPTION_LIMIT);
    }
    setEmoji(id: string, name: string, animated: boolean) {
        const emoji = new Emoji(id, name);
        emoji.setAnimated(animated);
        this.emoji = emoji;
    }
    setDefault(isDefault?: boolean) { this.default = isDefault; }
}

/**
 * Select menu for users.
 * https://discord.com/developers/docs/interactions/message-components#select-menu-object
 */
export class UserSelect extends SelectMenu {
    type: MESSAGE_COMPONENT_TYPE = MESSAGE_COMPONENT_TYPE.USER_SELECT;
}

/**
 * Select menu for roles.
 * https://discord.com/developers/docs/interactions/message-components#select-menu-object
 */
export class RoleSelect extends SelectMenu {
    type: MESSAGE_COMPONENT_TYPE = MESSAGE_COMPONENT_TYPE.ROLE_SELECT;
}

/**
 * Select menu for mentionables (users AND roles).
 * https://discord.com/developers/docs/interactions/message-components#select-menu-object
 */
export class MentionableSelect extends SelectMenu {
    type: MESSAGE_COMPONENT_TYPE = MESSAGE_COMPONENT_TYPE.MENTIONABLE_SELECT;
}

/**
 * Select menu for channels.
 * https://discord.com/developers/docs/interactions/message-components#select-menu-object
 */
export class ChannelSelect extends SelectMenu {
    type: MESSAGE_COMPONENT_TYPE = MESSAGE_COMPONENT_TYPE.CHANNEL_SELECT;
    channel_types?: CHANNEL_TYPE[] = [];
    
    addChannelType(channelType: CHANNEL_TYPE) {
        if (!this.channel_types?.includes(channelType)) {
            this.channel_types?.push(channelType);
        }
    }
}

const TEXT_INPUT_CUSTOM_ID_LIMIT = 100;
const TEXT_INPUT_LABEL_LIMIT = 45;
const TEXT_INPUT_MIN_LENGTH = 1; // 0 for max_length (subtract 1)
const TEXT_INPUT_MAX_LENGTH = 4000;
const TEXT_INPUT_VALUE_LIMIT = 4000;
const TEXT_INPUT_PLACEHOLDER_LIMIT = 100;
/**
 * Interactive component that render in modals.
 * https://discord.com/developers/docs/interactions/message-components#text-inputs
 */
export class TextInput extends MessageComponent {
    type: MESSAGE_COMPONENT_TYPE = MESSAGE_COMPONENT_TYPE.TEXT_INPUT;
    custom_id: string
    style: TEXT_INPUT_STYLE
    label: string
    min_length?: number = TEXT_INPUT_MIN_LENGTH;
    max_length?: number = TEXT_INPUT_MAX_LENGTH;
    required?: boolean = true;
    value?: string
    placeholder?: string
    
    constructor(custom_id: string, style: TEXT_INPUT_STYLE, label: string) {
        super();
        if (custom_id.length >= TEXT_INPUT_CUSTOM_ID_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${TEXT_INPUT_CUSTOM_ID_LIMIT} characters in text input custom id.\n` +
                `${JSON.stringify(custom_id)}`);
        }
        if (label.length >= TEXT_INPUT_LABEL_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${TEXT_INPUT_LABEL_LIMIT} characters in text input label.\n` +
                `${JSON.stringify(label)}`);
        }
        this.custom_id = custom_id.slice(0, TEXT_INPUT_CUSTOM_ID_LIMIT);
        this.style = style;
        this.label = label.slice(0, TEXT_INPUT_LABEL_LIMIT);
    }

    setMinLength(minLength: number) {
        if (!(TEXT_INPUT_MIN_LENGTH <= minLength && minLength <= TEXT_INPUT_MAX_LENGTH)) {
            console.error(
                `The condition must be met: ${TEXT_INPUT_MIN_LENGTH} <= minLength <= ${TEXT_INPUT_MAX_LENGTH} in text input.\n` +
                `${JSON.stringify(minLength)}`);
            return;
        }
        this.min_length = minLength;
    }
    setMaxLength(maxLength: number) {
        if (!(TEXT_INPUT_MIN_LENGTH-1 <= maxLength && maxLength <= TEXT_INPUT_MAX_LENGTH)) {
            console.error(
                `The condition must be met: ${TEXT_INPUT_MIN_LENGTH-1} <= maxLength <= ${TEXT_INPUT_MAX_LENGTH} in text input.\n` +
                `${JSON.stringify(maxLength)}`);
            return;
        }
        this.max_length = maxLength;
    }
    setRequired(isRequired: boolean) { this.required = isRequired; }
    setValue(value: string) {
        if (value.length >= TEXT_INPUT_VALUE_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${TEXT_INPUT_VALUE_LIMIT} characters in text input value.\n` +
                `${JSON.stringify(value)}`);
        }
        this.value = value.slice(0, TEXT_INPUT_VALUE_LIMIT);
    }
    setPlaceholder(placeholder: string) {
        if (placeholder.length >= TEXT_INPUT_PLACEHOLDER_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${TEXT_INPUT_PLACEHOLDER_LIMIT} characters in text input placeholder.\n` +
                `${JSON.stringify(placeholder)}`);
        }
        this.placeholder = placeholder.slice(0, TEXT_INPUT_PLACEHOLDER_LIMIT);
    }
}
