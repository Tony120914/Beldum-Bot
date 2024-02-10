import {
    BUTTON_STYLE_TYPES,
    CHANNEL_TYPES,
    DEFAULT_VALUE_TYPES,
    MESSAGE_COMPONENT_TYPES,
    TEXT_INPUT_STYLES,
} from "./DiscordEnums";

/**
 * Parent structure for all 8 Message Components.
 * Belongs to Interaction Response's data.
 */
export abstract class Component {
    type: MESSAGE_COMPONENT_TYPES
}

const ACTION_ROW_BUTTON_LIMIT = 5;
const ACTION_ROW_SELECT_MENU_LIMIT = 1;
/**
 * Non-interactive container component for other types of components.
 */
export class ActionRow extends Component {
    type: MESSAGE_COMPONENT_TYPES = MESSAGE_COMPONENT_TYPES.ACTION_ROW;
    components: Component[] = [];

    #buttonCount: number = 0;
    #selectMenuCount: number = 0;

    addComponent(component: Component) {
        switch (component.type) {
            case MESSAGE_COMPONENT_TYPES.ACTION_ROW: {
                console.error(`Action Rows cannot contain another Action Row.\n${JSON.stringify(component)}`);
                return;
            }
            case MESSAGE_COMPONENT_TYPES.BUTTON: {
                if (this.#buttonCount >= ACTION_ROW_BUTTON_LIMIT) {
                    console.error(`Action Rows cannot contain more than ${ACTION_ROW_BUTTON_LIMIT} buttons.\n${JSON.stringify(component)}`);
                    return;
                }
                if (this.#selectMenuCount >= 0) {
                    console.error(`Action Rows cannot contain both buttons and select menu components.\n${JSON.stringify(component)}`);                
                    return;
                }
                this.#buttonCount+=1;
                break;
            }
            case MESSAGE_COMPONENT_TYPES.STRING_SELECT:
            case MESSAGE_COMPONENT_TYPES.USER_SELECT:
            case MESSAGE_COMPONENT_TYPES.ROLE_SELECT:
            case MESSAGE_COMPONENT_TYPES.MENTIONABLE_SELECT:
            case MESSAGE_COMPONENT_TYPES.CHANNEL_SELECT: {
                if (this.#selectMenuCount >= ACTION_ROW_SELECT_MENU_LIMIT) {
                    console.error(`Action Rows cannot contain more than ${ACTION_ROW_SELECT_MENU_LIMIT} select menu.\n${JSON.stringify(component)}`);
                    return;
                }
                if (this.#buttonCount >= 0) {
                    console.error(`Action Rows cannot contain both buttons and select menu components.\n${JSON.stringify(component)}`);                
                    return;
                }
                this.#selectMenuCount+=1;
                break;
            }
            default: {
                console.error(`Invalid Component type.\n${JSON.stringify(component)}`);
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
 */
abstract class Button extends Component {
    type: MESSAGE_COMPONENT_TYPES = MESSAGE_COMPONENT_TYPES.BUTTON;
    style: BUTTON_STYLE_TYPES
    label?: string
    // emoji?: Emoji  // TODO
    custom_id?: string
    url?: string
    disabled?: boolean = false;

    static STYLES = BUTTON_STYLE_TYPES;

    setLabel(label: string) {
        if (label.length >= BUTTON_LABEL_LIMIT) {
            console.error(`Attempted to exceed limit of ${BUTTON_LABEL_LIMIT} characters in button label.\n${JSON.stringify(label)}`);
        }
        this.label = label.slice(0, BUTTON_LABEL_LIMIT);
    }
    // setEmoji(emoji) { ; } // TODO: emoji setter?
    setDisabled(disabled: boolean) { this.disabled = disabled; }
}

/**
 * Interactive non-link button component.
 */
export class ButtonNonLink extends Button {
    constructor(custom_id: string) {
        super();
        if (custom_id.length >= BUTTON_CUSTOM_ID_LIMIT) {
            console.error(`Attempted to exceed limit of ${BUTTON_CUSTOM_ID_LIMIT} characters in button custom id.\n${JSON.stringify(custom_id)}`);
        }
        this.custom_id = custom_id.slice(0, BUTTON_CUSTOM_ID_LIMIT);
        this.url = undefined;
    }

    setStyle(style: BUTTON_STYLE_TYPES) {
        if (style == BUTTON_STYLE_TYPES.LINK) {
            console.error(`ButtonNonLink cannot be a Link Button. Use ButtonLink instead.\n${JSON.stringify(style)}`);
            return;
        }
        this.style = style;
    }
}

/**
 * Interactive link button component.
 */
export class ButtonLink extends Button {
    style: BUTTON_STYLE_TYPES = BUTTON_STYLE_TYPES.LINK;

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
 */
abstract class SelectMenu extends Component {
    type: MESSAGE_COMPONENT_TYPES
    custom_id: string
    placeholder?: string
    default_values?: DefaultValue[] = []
    min_values?: number = 1;
    max_values?: number = 1;
    disabled?: boolean = false;

    static DEFAULT_VALUE_TYPES = DEFAULT_VALUE_TYPES

    constructor(custom_id: string) {
        super();
        if (custom_id.length >= SELECT_MENU_CUSTOM_ID_LIMIT) {
            console.error(`Attempted to exceed limit of ${SELECT_MENU_CUSTOM_ID_LIMIT} characters in select menu custom id.\n${JSON.stringify(custom_id)}`);
        }
        this.custom_id = custom_id.slice(0, SELECT_MENU_CUSTOM_ID_LIMIT);
    }

    setPlaceholder(placeholder: string) {
        if (placeholder.length >= SELECT_MENU_PLACEHOLDER_LIMIT) {
            console.error(`Attempted to exceed limit of ${SELECT_MENU_PLACEHOLDER_LIMIT} characters in select menu placeholder.\n${JSON.stringify(placeholder)}`);
        }
        this.placeholder = placeholder.slice(0, SELECT_MENU_PLACEHOLDER_LIMIT);
    }
    addDefaultValue(id: string, type: DEFAULT_VALUE_TYPES) {
        const defaultValue = new DefaultValue(id, type);
        this.default_values?.push(defaultValue);
    }
    setMinValues(minValues: number) {
        if (!(SELECT_MENU_MIN_VALUES_LIMIT <= minValues && minValues <= SELECT_MENU_MAX_VALUES_LIMIT)) {
            console.error(`The condition must be met: ${SELECT_MENU_MIN_VALUES_LIMIT} <= min_values <= ${SELECT_MENU_MAX_VALUES_LIMIT} in select menu.\n${JSON.stringify(minValues)}`);
            return;
        }
        this.min_values = minValues;
    }
    setMaxValues(maxValues: number) {
        if (!(SELECT_MENU_MIN_VALUES_LIMIT <= maxValues && maxValues <= SELECT_MENU_MAX_VALUES_LIMIT)) {
            console.error(`The condition must be met: ${SELECT_MENU_MIN_VALUES_LIMIT} <= max_values <= ${SELECT_MENU_MAX_VALUES_LIMIT} in select menu.\n${JSON.stringify(maxValues)}`);
            return;
        }
        this.max_values = maxValues;
    }
    setDisabled(disabled: boolean) { this.disabled = disabled; }
}

/** 
 * Auto-populated select menu components.
 */
class DefaultValue {
    id: string
    type: DEFAULT_VALUE_TYPES

    constructor(id: string, type: DEFAULT_VALUE_TYPES) {
        this.id = id;
        this.type = type;
    }
}

const STRING_SELECT_OPTIONS_LIMIT = 25;
/**
 * Select menu for strings.
 */
export class StringSelect extends SelectMenu {
    type: MESSAGE_COMPONENT_TYPES = MESSAGE_COMPONENT_TYPES.STRING_SELECT;
    options?: StringSelectOption[] = [];

    addOption(label: string, value: string, description?: string, /*emoji?: Emoji, */ selected?: boolean) {
        const option = new StringSelectOption(label, value);
        option.setDescription(description);
        // option.setEmoji(emoji);
        option.setDefault(selected);

        if (!this.options) { return; }
        if (this.options.length >= STRING_SELECT_OPTIONS_LIMIT) {
            console.error(`Attempted to exceed limit of ${STRING_SELECT_OPTIONS_LIMIT} options in string select.\n${JSON.stringify(option)}`);
        }
        this.options.push(option);
    }
}

const STRING_SELECT_OPTION_LABEL_LIMIT = 100;
const STRING_SELECT_OPTION_VALUE_LIMIT = 100;
const STRING_SELECT_OPTION_DESCRIPTION_LIMIT = 100;
/**
 * String Select options.
 */
class StringSelectOption {
    label: string
    value: string
    description?: string
    // emoji?: partial Emoji //TODO
    default?: boolean

    constructor(label: string, value: string) {
        if (label.length >= STRING_SELECT_OPTION_LABEL_LIMIT) {
            console.error(`Attempted to exceed limit of ${STRING_SELECT_OPTION_LABEL_LIMIT} characters in string select option label.\n${JSON.stringify(label)}`);
        }
        if (value.length >= STRING_SELECT_OPTION_VALUE_LIMIT) {
            console.error(`Attempted to exceed limit of ${STRING_SELECT_OPTION_VALUE_LIMIT} characters in string select option value.\n${JSON.stringify(value)}`);
        }
        this.label = label.slice(0, STRING_SELECT_OPTION_LABEL_LIMIT);
        this.value = value.slice(0, STRING_SELECT_OPTION_VALUE_LIMIT);
    }

    setDescription(description?: string) {
        if (!description) { return; }
        if (description.length >= STRING_SELECT_OPTION_DESCRIPTION_LIMIT) {
            console.error(`Attempted to exceed limit of ${STRING_SELECT_OPTION_DESCRIPTION_LIMIT} characters in string select option description.\n${JSON.stringify(description)}`);
        }
        this.description = description.slice(0, STRING_SELECT_OPTION_DESCRIPTION_LIMIT);
    }
    // setEmoji() {  } //TODO
    setDefault(selected?: boolean) { this.default = selected; }
}

/**
 * Select menu for users.
 */
export class UserSelect extends SelectMenu {
    type: MESSAGE_COMPONENT_TYPES = MESSAGE_COMPONENT_TYPES.USER_SELECT;
}

/**
 * Select menu for roles.
 */
export class RoleSelect extends SelectMenu {
    type: MESSAGE_COMPONENT_TYPES = MESSAGE_COMPONENT_TYPES.ROLE_SELECT;
}

/**
 * Select menu for mentionables (users AND roles).
 */
export class MentionableSelect extends SelectMenu {
    type: MESSAGE_COMPONENT_TYPES = MESSAGE_COMPONENT_TYPES.MENTIONABLE_SELECT;
}

/**
 * Select menu for channels.
 */
export class ChannelSelect extends SelectMenu {
    type: MESSAGE_COMPONENT_TYPES = MESSAGE_COMPONENT_TYPES.CHANNEL_SELECT;
    channel_types?: CHANNEL_TYPES[] = [];

    static TYPES = CHANNEL_TYPES;
    
    addChannelType(channelType: CHANNEL_TYPES) {
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
 */
export class TextInput extends Component {
    type: MESSAGE_COMPONENT_TYPES = MESSAGE_COMPONENT_TYPES.TEXT_INPUT;
    custom_id: string
    style: TEXT_INPUT_STYLES
    label: string
    min_length?: number
    max_length?: number
    required?: boolean = true;
    value?: string
    placeholder?: string

    static STYLES = TEXT_INPUT_STYLES;
    
    constructor(custom_id: string, style: TEXT_INPUT_STYLES, label: string) {
        super();
        if (custom_id.length >= TEXT_INPUT_CUSTOM_ID_LIMIT) {
            console.error(`Attempted to exceed limit of ${TEXT_INPUT_CUSTOM_ID_LIMIT} characters in text input custom id.\n${JSON.stringify(custom_id)}`);
        }
        if (label.length >= TEXT_INPUT_LABEL_LIMIT) {
            console.error(`Attempted to exceed limit of ${TEXT_INPUT_LABEL_LIMIT} characters in text input label.\n${JSON.stringify(label)}`);
        }
        this.custom_id = custom_id.slice(0, TEXT_INPUT_CUSTOM_ID_LIMIT);
        this.style = style;
        this.label = label.slice(0, TEXT_INPUT_LABEL_LIMIT);
    }

    setMinLength(minLength: number) {
        if (!(TEXT_INPUT_MIN_LENGTH <= minLength && minLength <= TEXT_INPUT_MAX_LENGTH)) {
            console.error(`The condition must be met: ${TEXT_INPUT_MIN_LENGTH} <= minLength <= ${TEXT_INPUT_MAX_LENGTH} in text input.\n${JSON.stringify(minLength)}`);
            return;
        }
        this.min_length = minLength;
    }
    setMaxLength(maxLength: number) {
        if (!(TEXT_INPUT_MIN_LENGTH-1 <= maxLength && maxLength <= TEXT_INPUT_MAX_LENGTH)) {
            console.error(`The condition must be met: ${TEXT_INPUT_MIN_LENGTH-1} <= maxLength <= ${TEXT_INPUT_MAX_LENGTH} in text input.\n${JSON.stringify(maxLength)}`);
            return;
        }
        this.max_length = maxLength;
    }
    setRequired(required: boolean) { this.required = required; }
    setValue(value: string) {
        if (value.length >= TEXT_INPUT_VALUE_LIMIT) {
            console.error(`Attempted to exceed limit of ${TEXT_INPUT_VALUE_LIMIT} characters in text input value.\n${JSON.stringify(value)}`);
        }
        this.value = value.slice(0, TEXT_INPUT_VALUE_LIMIT);
    }
    setPlaceholder(placeholder: string) {
        if (placeholder.length >= TEXT_INPUT_PLACEHOLDER_LIMIT) {
            console.error(`Attempted to exceed limit of ${TEXT_INPUT_PLACEHOLDER_LIMIT} characters in text input placeholder.\n${JSON.stringify(placeholder)}`);
        }
        this.placeholder = placeholder.slice(0, TEXT_INPUT_PLACEHOLDER_LIMIT);
    }
}
