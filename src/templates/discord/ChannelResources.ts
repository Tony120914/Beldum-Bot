import {
    ALLOWED_MENTION_TYPE, ATTACHMENT_FLAGS, CHANNEL_FLAGS, CHANNEL_TYPE,
} from './Enums';
import { Resource } from './Resource';
import { User } from './UserResources';

/**
 * Channel structure
 * https://discord.com/developers/docs/resources/channel#channel-object
 */
export class Channel extends Resource {
    id: string
    type: CHANNEL_TYPE
    guild_id?: string
    position?: number
    permission_overwrites?: Overwrite[] = [];
    name?: string
    topic?: string
    nsfw?: boolean
    last_message_id?: string
    bitrate?: number
    user_limit?: number
    rate_limit_per_user?: number
    recipients?: User[] = [];
    icon?: string
    owner_id?: string
    application_id?: string
    managed?: boolean
    parent_id?: string
    last_pin_timestamp?: string //ISO8601 timestamp
    rtc_region?: string
    video_quality_mode?: number
    message_count?: number
    member_count?: number
    thread_metadata?: ThreadMetadata
    member?: ThreadMember
    default_auto_archive_duration?: number
    permissions?: string
    flags?: CHANNEL_FLAGS
    total_message_sent?: number
    available_tags?: ForumTag[]
    applied_tags?: string[]
    default_reaction_emoji?: DefaultReaction
    default_thread_rate_limit_per_user?: number
    default_sort_order?: number
    default_forum_layout?: number

    constructor(id: string, type: CHANNEL_TYPE) {
        super();
        this.id = id;
        this.type = type;
    }
}

/**
 * Overwrite structure
 * https://discord.com/developers/docs/resources/channel#overwrite-object
 */
export class Overwrite {
}

/**
 * Thread Metadata structure
 * https://discord.com/developers/docs/resources/channel#thread-metadata-object
 */
export class ThreadMetadata {
}

/**
 * Thread Member structure
 * https://discord.com/developers/docs/resources/channel#thread-member-object
 */
export class ThreadMember {
}

/**
 * Forum Tag structure
 * https://discord.com/developers/docs/resources/channel#forum-tag-object
 */
export class ForumTag {
}

/**
 * Default Reaction structure
 * https://discord.com/developers/docs/resources/channel#default-reaction-object
 */
export class DefaultReaction {
}

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
