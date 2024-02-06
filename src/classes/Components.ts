import {
    MessageComponentTypes,
    ButtonStyleTypes,
} from 'discord-interactions';

/**
 * Parent structure for all 8 Message Components.
 * Belongs to Interaction Response's data.
 */
export abstract class Component {
    type: number
}

const BUTTON_LIMIT = 5;
const SELECT_MENU_LIMIT = 1;
/**
 * Non-interactive container component for other types of components.
 */
export class ActionRow extends Component {
    type: number = MessageComponentTypes.ACTION_ROW;
    components: Component[] = [];

    #buttonCount: number = 0;
    #selectMenuCount: number = 0;

    addComponent(component: Component) {
        switch (component.type) {
            case MessageComponentTypes.ACTION_ROW: {
                console.error(`Action Rows cannot contain another Action Row.\n${JSON.stringify(component)}`);
                return;
            }
            case MessageComponentTypes.BUTTON: {
                if (this.#buttonCount >= BUTTON_LIMIT) {
                    console.error(`Action Rows cannot contain more than ${BUTTON_LIMIT} buttons.\n${JSON.stringify(component)}`);
                    return;
                }
                if (this.#selectMenuCount >= 0) {
                    console.error(`Action Rows cannot contain both buttons and select menu components.\n${JSON.stringify(component)}`);                
                    return;
                }
                this.#buttonCount+=1;
                break;
            }
            //TODO: more expressions in this case
            case MessageComponentTypes.STRING_SELECT: {
                if (this.#selectMenuCount >= SELECT_MENU_LIMIT) {
                    console.error(`Action Rows cannot contain more than ${SELECT_MENU_LIMIT} select menu.\n${JSON.stringify(component)}`);
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

const LABEL_LIMIT = 80;
const CUSTOM_ID_LIMIT = 100;
/**
 * Parent structure for all 5 types of interactive button components.
 */
abstract class Button extends Component {
    type: number = MessageComponentTypes.BUTTON;
    style: number
    label?: string
    // emoji?: Emoji  // TODO
    custom_id?: string
    url?: string
    disabled?: boolean = false;

    setLabel(label: string) {
        if (label.length >= LABEL_LIMIT) {
            console.error(`Attempted to exceed limit of ${LABEL_LIMIT} characters in button label.\n${JSON.stringify(label)}`);
        }
        this.label = label.slice(0, LABEL_LIMIT);
    }
    // setEmoji(emoji) { ; } // TODO: emoji setter?
    setDisabled(disabled: boolean) { this.disabled = disabled; }
}

/**
 * Parent structure for interactive non-link button components.
 */
abstract class ButtonNonLink extends Button {
    constructor(custom_id: string) {
        super();
        if (custom_id.length >= CUSTOM_ID_LIMIT) {
            console.error(`Attempted to exceed limit of ${CUSTOM_ID_LIMIT} characters in button custom id.\n${JSON.stringify(custom_id)}`);
        }
        this.custom_id = custom_id.slice(0, CUSTOM_ID_LIMIT);
        this.url = undefined;
    }
}

/**
 * Interactive non-link primary button component.
 */
export class ButtonPrimary extends ButtonNonLink {
    style: number = ButtonStyleTypes.PRIMARY;
}

/**
 * Interactive non-link secondary button component.
 */
export class ButtonSecondary extends ButtonNonLink {
    style: number = ButtonStyleTypes.SECONDARY;
}

/**
 * Interactive non-link success button component.
 */
export class ButtonSuccess extends ButtonNonLink {
    style: number = ButtonStyleTypes.SUCCESS;
}

/**
 * Interactive non-link danger button component.
 */
export class ButtonDanger extends ButtonNonLink {
    style: number = ButtonStyleTypes.DANGER;
}

/**
 * Interactive link button component.
 */
export class ButtonLink extends Button {
    style: number = ButtonStyleTypes.LINK;

    constructor(url: string) {
        super();
        this.url = url;
        this.custom_id = undefined;
    }
}

const PLACEHOLDER_LIMIT = 150;
const MIN_VALUES_LIMIT = 0;
const MAX_VALUES_LIMIT = 25;
/**
 * Parent structure for all 5 select menu components.
 */
abstract class SelectMenu extends Component {
    type: number
    custom_id: string
    placeholder?: string
    min_values?: number = 1;
    max_values?: number = 1;
    disabled?: boolean = false;

    constructor(custom_id: string) {
        super();
        this.custom_id = custom_id;
    }
}

/**
 * Select menu for strings.
 */
export class StringSelect extends SelectMenu {
    //TODO
}

/**
 * Select menu for users.
 */
export class UserSelect extends SelectMenu {
    
}

/**
 * Select menu for roles.
 */
export class RoleSelect extends SelectMenu {
    
}

/**
 * Select menu for mentionables (users AND roles).
 */
export class MentionableSelect extends SelectMenu {
    
}

/**
 * Select menu for channels.
 */
export class ChannelSelect extends SelectMenu {
    
}
