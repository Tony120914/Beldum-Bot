import {
    INTERACTION_RESPONSE_FLAGS,
    INTERACTION_RESPONSE_TYPE,
    MESSAGE_COMPONENT_TYPE,
} from './Enums';
import { Embed } from './Embed';
import { AllowedMentions, Attachment } from './ChannelResources';
import { MessageComponent } from './MessageComponents';

/**
 * Response to an interaction
 * https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
 */
export class InteractionResponse {
    type: INTERACTION_RESPONSE_TYPE;
    data?: Data = new Data();

    constructor(type: INTERACTION_RESPONSE_TYPE) {
        this.type = type;
    }

    setType(type: INTERACTION_RESPONSE_TYPE) { this.type = type; }
}

const DATA_EMBEDS_LIMIT = 10;
const DATA_ACTION_ROW_LIMIT = 5;
/**
 * Interaction response's data structure
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure
 */
class Data {
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
        if (this.embeds.length >= DATA_EMBEDS_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${DATA_EMBEDS_LIMIT} embeds.\n` +
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
        if (this.components.length >= DATA_ACTION_ROW_LIMIT) {
            console.error(
                `Attempted to exceed limit of ${DATA_ACTION_ROW_LIMIT} action rows per message.\n` +
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
