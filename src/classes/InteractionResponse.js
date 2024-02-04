import {
    InteractionResponseType,
    InteractionResponseFlags,
} from 'discord-interactions';

const EMBEDS_LIMIT = 10;

// Structure for interaction responses
export class InteractionResponse {
    type = InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE;
    data = new Data();

    setInteractionResponseType_PONG() { this.type = InteractionResponseType.PONG; }
    setInteractionResponseType_CHANNEL_MESSAGE_WITH_SOURCE() { this.type = InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE; }
    setInteractionResponseType_DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE() { this.type = InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE; }
    setInteractionResponseType_DEFERRED_UPDATE_MESSAGE() { this.type = InteractionResponseType.DEFERRED_UPDATE_MESSAGE; }
    setInteractionResponseType_UPDATE_MESSAGE() { this.type = InteractionResponseType.UPDATE_MESSAGE; }
    setInteractionResponseType_APPLICATION_COMMAND_AUTOCOMPLETE_RESULT() { this.type = InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT; }
    setInteractionResponseType_MODAL() { this.type = InteractionResponseType.MODAL; }
    // setInteractionResponseTypePREMIUM_REQUIRED() { this.type = InteractionResponseType.PREMIUM_REQUIRED; }
}

class Data {
    tts = false;
    content = '';
    embeds = [];
    allowed_mentions = new AllowedMentions();
    flags = 0;
    components = [];
    attachments = [];

    setTtsOn() { this.tts = true; }
    setContent(content) { this.content = content; }
    addEmbed(embed) {
        if (this.embeds.length >= EMBEDS_LIMIT) {
            console.error(`Attempted to exceed limit of ${EMBEDS_LIMIT} embeds.\n${JSON.stringify(embed)}`);
            return;
        }
        this.embeds.push(embed);
    }
    // setFlags_SUPPRESS_EMBEDS() { this.flags = InteractionResponseFlags.SUPPRESS_EMBEDS; }
    setFlags_EPHEMERAL() { this.flags = InteractionResponseFlags.EPHEMERAL; }
    // TODO components
    // TODO attachments
}


const ALLOWED_MENTION_TYPES = {
    roles: 'roles',
    users: 'users',
    everyone: 'everyone',
}
const ROLES_LIMIT = 100;
const USERS_LIMIT = 100;

class AllowedMentions {
    parse = [];
    roles = [];
    users = [];
    replied_user = false;

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
    addRoles(roles) {
        if (this.roles.length >= ROLES_LIMIT) {
            console.error(`Attempted to exceed limit of ${ROLES_LIMIT} allowed mentions roles.\n${JSON.stringify(roles)}`);
            return;
        }
        this.roles.push(roles);
    }
    addUsers(users) {
        if (this.users.length >= USERS_LIMIT) {
            console.error(`Attempted to exceed limit of ${USERS_LIMIT} allowed mentions users.\n${JSON.stringify(users)}`);
            return;
        }
        this.users.push(users);
    }
    setRepliedUserOn() { this.replied_user = true; }
}

class Component {
    type = -1;
    components = [];
    //TODO
}
