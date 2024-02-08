import {
    ALLOWED_MENTION_TYPES,
    INTERACTION_RESPONSE_FLAGS,
    INTERACTION_RESPONSE_TYPE,
    MESSAGE_COMPONENT_TYPES,
} from './DiscordEnums';
import { Embed } from './Embed';
import { Component } from './Components';

/**
 * Response to an interaction
 */
export class InteractionResponse {
    type: INTERACTION_RESPONSE_TYPE;
    data?: Data = new Data();

    static TYPE = INTERACTION_RESPONSE_TYPE;
    static ALLOWED_MENTION_TYPES = ALLOWED_MENTION_TYPES;
    static FLAGS = INTERACTION_RESPONSE_FLAGS;

    constructor(type: INTERACTION_RESPONSE_TYPE) {
        this.type = type;
    }
}

const DATA_EMBEDS_LIMIT = 10;
const DATA_ACTION_ROW_LIMIT = 5;
/**
 * Interaction response's data structure
 */
class Data {
    tts?: boolean
    content?: string
    embeds?: Embed[] = [];
    allowed_mentions?: AllowedMentions = new AllowedMentions();
    flags?: INTERACTION_RESPONSE_FLAGS
    components?: Component[]
    // attachments?: partial Attachment[]

    setTts(on: boolean) { this.tts = on; }
    setContent(content: string) { this.content = content; }
    addEmbed(embed: Embed) {
        if (!this.embeds) { return; }
        if (this.embeds.length >= DATA_EMBEDS_LIMIT) {
            console.error(`Attempted to exceed limit of ${DATA_EMBEDS_LIMIT} embeds.\n${JSON.stringify(embed)}`);
            return;
        }
        this.embeds.push(embed);
    }
    setFlags(flags: INTERACTION_RESPONSE_FLAGS) { this.flags = flags; }
    addComponent(component: Component) {
        if (!this.components) { return; }
        if (component.type != MESSAGE_COMPONENT_TYPES.ACTION_ROW) {
            console.error(`Top-level components field must be action rows.\n${JSON.stringify(component)}`);
            return;
        }
        if (this.components.length >= DATA_ACTION_ROW_LIMIT) {
            console.error(`Attempted to exceed limit of ${DATA_ACTION_ROW_LIMIT} action rows per message.\n${JSON.stringify(component)}`);
            return;
        }
        this.components.push(component);
    }
    // TODO attachments
}

const ALLOWED_MENTION_ROLES_LIMIT = 100;
const ALLOWED_MENTION_USERS_LIMIT = 100;
/**
 * Interaction responses data's Allowed Mentions structure
 */
class AllowedMentions {
    parse: ALLOWED_MENTION_TYPES[] = [];
    roles: string[] = [];
    users: string[] = [];
    replied_user: boolean = false;

    addParse(type: ALLOWED_MENTION_TYPES) {
        if (!this.parse.includes(type)) {
            this.parse.push(type);
        }
    }
    addRoles(role: string) {
        if (this.roles.length >= ALLOWED_MENTION_ROLES_LIMIT) {
            console.error(`Attempted to exceed limit of ${ALLOWED_MENTION_ROLES_LIMIT} allowed mentions roles.\n${JSON.stringify(role)}`);
            return;
        }
        this.roles.push(role);
    }
    addUsers(user: string) {
        if (this.users.length >= ALLOWED_MENTION_USERS_LIMIT) {
            console.error(`Attempted to exceed limit of ${ALLOWED_MENTION_USERS_LIMIT} allowed mentions users.\n${JSON.stringify(user)}`);
            return;
        }
        this.users.push(user);
    }
    setRepliedUser(on: boolean) { this.replied_user = on; }
}
