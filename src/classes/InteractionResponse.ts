import {
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
} from 'discord-interactions';
import { Embed } from './Embed';
import { Component } from './Components';

/**
 * Parent structure for all 8 Interaction Responses
 */
abstract class InteractionResponse {
    type: number;
    data?: Data = new Data();
}

/**
 * Interaction Response to ACK a ping.
 */
export class InteractionResponse_PONG extends InteractionResponse {
    type: number = InteractionResponseType.PONG;
}

/**
 * Interaction Response with a simple message.
 */
export class InteractionResponse_CHANNEL_MESSAGE_WITH_SOURCE extends InteractionResponse {
    type: number = InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE;
}

/**
 * Interaction Response to ACK an interaction and edit later.
 * The user sees a loading state.
 */
export class InteractionResponse_DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE extends InteractionResponse {
    type: number = InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE;
}

/**
 * Interaction Response to ACK an interaction and edit later.
 * The user does NOT see a loading state.
 * COMPONENTS ONLY.
 */
export class InteractionResponse_DEFERRED_UPDATE_MESSAGE extends InteractionResponse {
    type: number = InteractionResponseType.DEFERRED_UPDATE_MESSAGE;
}

/**
 * Interaction Response to edit the message the component was attached to.
 * COMPONENTS ONLY.
 */
export class InteractionResponse_UPDATE_MESSAGE extends InteractionResponse {
    type: number = InteractionResponseType.UPDATE_MESSAGE;
}

/**
 * Interaction Response to an autocomplete interaction with suggested choices.
 */
export class InteractionResponse_APPLICATION_COMMAND_AUTOCOMPLETE_RESULT extends InteractionResponse {
    type: number = InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT;
}

/**
 * Interaction Response to a popup modal.
 * NOT available for MODAL_SUBMIT and PING interactions.
 */
export class InteractionResponse_MODAL extends InteractionResponse {
    type: number = InteractionResponseType.MODAL;
}

/**
 * Interaction Response to an upgrade button.
 * MONETIZED APPS ONLY.
 */
// export class InteractionResponse_PREMIUM_REQUIRED extends InteractionResponse {
//     type: number = InteractionResponseType.PREMIUM_REQUIRED;
// }

const EMBEDS_LIMIT = 10;
const ACTION_ROW_LIMIT = 5;
/**
 * Interaction response's data structure
 */
class Data {
    tts?: boolean
    content?: string
    embeds?: Embed[] = [];
    allowed_mentions?: AllowedMentions = new AllowedMentions();
    flags?: number
    components?: Component[]
    // attachments?: partial Attachment[]

    setTts(on: boolean) { this.tts = on; }
    setContent(content: string) { this.content = content; }
    addEmbed(embed: Embed) {
        if (!this.embeds) { return; }
        if (this.embeds.length >= EMBEDS_LIMIT) {
            console.error(`Attempted to exceed limit of ${EMBEDS_LIMIT} embeds.\n${JSON.stringify(embed)}`);
            return;
        }
        this.embeds.push(embed);
    }
    // setFlags_SUPPRESS_EMBEDS() { this.flags = InteractionResponseFlags.SUPPRESS_EMBEDS; } // not in 'discord-interactions' helper
    setFlags_EPHEMERAL() { this.flags = InteractionResponseFlags.EPHEMERAL; }
    addComponent(component: Component) {
        if (!this.components) { return; }
        if (component.type != MessageComponentTypes.ACTION_ROW) {
            console.error(`Top-level components field must be action rows.\n${JSON.stringify(component)}`);
            return;
        }
        if (this.components.length >= ACTION_ROW_LIMIT) {
            console.error(`Attempted to exceed limit of ${ACTION_ROW_LIMIT} action rows per message.\n${JSON.stringify(component)}`);
            return;
        }
        this.components.push(component);
    }
    // TODO attachments
}

const ALLOWED_MENTION_TYPES = {
    roles: 'roles',
    users: 'users',
    everyone: 'everyone',
}
const ROLES_LIMIT = 100;
const USERS_LIMIT = 100;
/**
 * Interaction responses data's Allowed Mentions structure
 */
class AllowedMentions {
    parse: string[] = [];
    roles: string[] = [];
    users: string[] = [];
    replied_user: boolean = false;

    allowParseRoles() {
        if (!this.parse.includes(ALLOWED_MENTION_TYPES.roles)) {
            this.parse.push(ALLOWED_MENTION_TYPES.roles);
        }
    }
    allowParseUsers() {
        if (!this.parse.includes(ALLOWED_MENTION_TYPES.users)) {
            this.parse.push(ALLOWED_MENTION_TYPES.users);
        }
    }
    allowParseEveryone() {
        if (!this.parse.includes(ALLOWED_MENTION_TYPES.everyone)) {
            this.parse.push(ALLOWED_MENTION_TYPES.everyone);
        }
    }
    addRoles(role: string) {
        if (this.roles.length >= ROLES_LIMIT) {
            console.error(`Attempted to exceed limit of ${ROLES_LIMIT} allowed mentions roles.\n${JSON.stringify(role)}`);
            return;
        }
        this.roles.push(role);
    }
    addUsers(user: string) {
        if (this.users.length >= USERS_LIMIT) {
            console.error(`Attempted to exceed limit of ${USERS_LIMIT} allowed mentions users.\n${JSON.stringify(user)}`);
            return;
        }
        this.users.push(user);
    }
    setRepliedUser(on: boolean) { this.replied_user = on; }
}
