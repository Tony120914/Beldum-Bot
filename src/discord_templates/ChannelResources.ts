import {
    ALLOWED_MENTION_TYPE, ATTACHMENT_FLAGS,
} from './Enums';

const ALLOWED_MENTION_ROLES_LIMIT = 100;
const ALLOWED_MENTION_USERS_LIMIT = 100;
/**
 * Allowed Mentions structure
 * https://discord.com/developers/docs/resources/channel#allowed-mentions-object
 */
export class AllowedMentions {
    parse: ALLOWED_MENTION_TYPE[] = [];
    roles: string[] = [];
    users: string[] = [];
    replied_user: boolean = false;

    addParse(type: ALLOWED_MENTION_TYPE) {
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
    setRepliedUser(isEnabled: boolean) { this.replied_user = isEnabled; }
}

const ATTACHMENT_DESCRIPTION_LIMIT = 1024;
/**
 * Attachment Structure
 * https://discord.com/developers/docs/resources/channel#attachment-object
 */
export class Attachment {
    id: string
    filename: string
    description?: string
    content_type?: string
    size: number
    url: string
    proxy_url: string
    height?: number
    width?: number
    ephemeral?: boolean
    duration_secs?: number
    waveform?: string
    flags?: ATTACHMENT_FLAGS

    constructor(id: string, filename?: string, size?: number, url?: string, proxy_url?: string) {
        this.id = id;

        // For the attachments array in Message Create/Edit requests, only the id is required.
        if (filename) { this.filename = filename; }
        if (size) { this.size = size; }
        if (url) { this.url = url; }
        if (proxy_url) { this.proxy_url = proxy_url; }
    }

    setDescription(description: string) {
        if (description.length >= ATTACHMENT_DESCRIPTION_LIMIT) {
            console.error(`Attempted to exceed limit of ${ATTACHMENT_DESCRIPTION_LIMIT} characters in attachment description.\n${JSON.stringify(description)}`);
        }
        this.description = description.slice(0, ATTACHMENT_DESCRIPTION_LIMIT);
    }
    setContentType(type: string) { this.content_type = type; }
    setHeight(height: number) { this.height = height; }
    setWidth(width: number) { this.width = width; }
    setEphemeral(isEphemeral: boolean) { this.ephemeral = isEphemeral; }
    setDurationSecs(durationSecs: number) { this.duration_secs = durationSecs; }
    setWaveform(waveform: string) { this.waveform = waveform; }
    setFlags(flags: ATTACHMENT_FLAGS) { this.flags = flags; }
}
