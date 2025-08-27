import { INTERACTION_RESPONSE_FLAGS, INTERACTION_CALLBACK_TYPE, MESSAGE_COMPONENT_TYPE, INTERACTION_TYPE, INTERACTION_DATA, APPLICATION_INTEGRATION_TYPE, INTERACTION_CONTEXT_TYPE } from './Enums.js';
import { Embed } from './Embed.js';
import { AllowedMentions, Attachment, type Channel } from './resources/ChannelResources.js';
import type { MessageComponent } from './MessageComponents.js';

/**
 * Response to an interaction
 * https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
 */
export class InteractionResponse {
    type: INTERACTION_CALLBACK_TYPE
    data?: InteractionCallbackData | MessageData | AutocompleteData | ModalData

    constructor(type: INTERACTION_CALLBACK_TYPE) {
        this.type = type;
    }

    initMessageData(): MessageData {
        this.data = new MessageData();
        return this.data as MessageData;
    }
    // TODO: when needed
    // initAutocompleteData(): AutocompleteData {
    //     this.data = new AutocompleteData();
    //     return this.data as AutocompleteData;
    // }
    initModalData(custom_id: string, title: string): ModalData {
        this.data = new ModalData(custom_id, title);
        return this.data as ModalData;
    }

    setType(type: INTERACTION_CALLBACK_TYPE) { this.type = type; }
    setData(data: InteractionCallbackData) { this.data = data; }
}

/**
 * Parent interface for interaction callback data structures.
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure
 */
interface InteractionCallbackData {
}

const MESSAGE_EMBEDS_LIMIT = 10;
const MESSAGE_ACTION_ROW_LIMIT = 5;
/**
 * Interaction response's data structure for message callbacks
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-messages
 */
class MessageData implements InteractionCallbackData {
    tts?: boolean
    content?: string
    embeds?: Embed[] = [];
    allowed_mentions?: AllowedMentions = new AllowedMentions();
    flags?: INTERACTION_RESPONSE_FLAGS
    components?: MessageComponent[] = [];
    attachments?: Attachment[] // Array of partial Attachment

    setTts(isEnabled: boolean) { this.tts = isEnabled; }
    setContent(content: string) { this.content = content; }
    addEmbed(embed: Embed) {
        if (!this.embeds) { return; }
        if (this.embeds.length >= MESSAGE_EMBEDS_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${MESSAGE_EMBEDS_LIMIT} embeds.\n` +
                `${JSON.stringify(embed)}`);
            return;
        }
        this.embeds.push(embed);
    }
    setFlags(flags: INTERACTION_RESPONSE_FLAGS) { this.flags = flags; }
    addComponent(component: MessageComponent) {
        if (!this.components) { return; }
        if (component.type != MESSAGE_COMPONENT_TYPE.ACTION_ROW) {
            console.error(
                `Top-level components field must be action rows.\n` +
                `${JSON.stringify(component)}`);
            return;
        }
        if (this.components.length >= MESSAGE_ACTION_ROW_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${MESSAGE_ACTION_ROW_LIMIT} action rows per message.\n` +
                `${JSON.stringify(component)}`);
            return;
        }
        this.components.push(component);
    }
    addAttachment(id: string, filename: string, description: string) {
        const attachment = new Attachment(id, filename);
        attachment.setDescription(description);
        this.attachments?.push(attachment);
    }
}

/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-autocomplete
 */
class AutocompleteData implements InteractionCallbackData {
    // TODO: when needed
}

const MODAL_CUSTOM_ID_LIMIT = 100;
const MODAL_TITLE_LIMIT = 45;
const MODAL_MAX_COMPONENT_LIMIT = 5;
/**
 * Interaction response's data structure for modal callbacks
 * (currently only supports the TEXT_INPUT component.)
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-modal
 */
export class ModalData implements InteractionCallbackData {
    custom_id: string
    title: string
    components: MessageComponent[] = []

    constructor(custom_id: string, title: string) {
        if (custom_id.length >= MODAL_CUSTOM_ID_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${MODAL_CUSTOM_ID_LIMIT} characters in modal custom id.\n` +
                `${JSON.stringify(custom_id)}`);
        }
        this.custom_id = custom_id.slice(0, MODAL_CUSTOM_ID_LIMIT);
        if (title.length >= MODAL_TITLE_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${MODAL_TITLE_LIMIT} characters in modal title.\n` +
                `${JSON.stringify(title)}`);
        }
        this.title = title.slice(0, MODAL_TITLE_LIMIT);
    }
    
    addComponent(component: MessageComponent) {
        if (component.type != MESSAGE_COMPONENT_TYPE.ACTION_ROW) {
            console.error(
                `Top-level components field must be action rows.\n` +
                `${JSON.stringify(component)}`);
            return;
        }
        if (this.components.length >= MODAL_MAX_COMPONENT_LIMIT) {
            console.error(
                `Modals cannot contain more than ${MODAL_MAX_COMPONENT_LIMIT} components.\n` +
                `${JSON.stringify(component)}`);
            return;
        }
        this.components.push(component);
    }
}
