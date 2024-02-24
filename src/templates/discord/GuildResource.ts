import { Emoji } from "./EmojiResources"
import { DEFAULT_MESSAGE_NOTIFICATION_LEVEL, EXPLICIT_CONTENT_FILTER_LEVEL, GUILD_FEATURE, GUILD_MEMBER_FLAGS, MFA_LEVEL, NSFW_LEVEL, PREMIUM_TIER, SYSTEM_CHANNEL_FLAGS, VERIFICATION_LEVEL } from "./Enums"
import { Role } from "./PermissionsResource"
import { Resource } from "./Resource"
import { Sticker } from "./StickerResource"
import { User } from "./UserResource"

/**
 * Guild/Server structure
 * https://discord.com/developers/docs/resources/guild#guild-object
 */
export class Guild extends Resource {
    id: string
    name: string
    icon?: string
    icon_hash?: string
    splash?: string
    discovery_splash?: string
    owner?: boolean
    owner_id: string
    permissions?: string
    afk_channel_id?: string
    afk_timeout: number
    widget_enabled?: boolean
    widget_channel_id?: string
    verification_level: VERIFICATION_LEVEL
    default_message_notifications: DEFAULT_MESSAGE_NOTIFICATION_LEVEL
    explicit_content_filter: EXPLICIT_CONTENT_FILTER_LEVEL
    roles: Role[] = []
    emojis: Emoji[] = []
    features: GUILD_FEATURE[] = []
    mfa_level: MFA_LEVEL
    application_id?: string
    system_channel_id?: string
    system_channel_flags: SYSTEM_CHANNEL_FLAGS
    rules_channel_id: string
    max_presences?: number
    max_members?: number
    vanity_url_code?: string
    description?: string
    banner?: string
    premium_tier: PREMIUM_TIER
    premium_subscription_count?: number
    preferred_locale: string
    public_updates_channel_id?: string
    max_video_channel_users?: number
    max_stage_video_channel_users?: number
    approximate_member_count?: number
    approximate_presence_count?: number
    welcome_screen?: WelcomeScreen
    nsfw_level: NSFW_LEVEL
    stickers?: Sticker[] = []
    premium_progress_bar_enabled: boolean
    safety_alerts_channel_id?: string

    constructor(id: string, name: string) {
        super();
        this.id = id;
        this.name = name;
    }

    setIcon(icon: string) { this.icon = icon; }
    setSplash(splash: string) { this.splash = splash; }
    setDiscoverySplash(discoverySplash: string) { this.discovery_splash = discoverySplash; }
    setOwnerId(ownerId: string) { this.owner_id = ownerId; }
    addRole(role: Role) { this.roles?.push(role); }
    addEmoji(emoji: Emoji) { this.emojis?.push(emoji); }
    setDescription(description: string) { this.description = description; }
    setBanner(banner: string) { this.banner = banner; }
    setPremiumTier(premiumTier: PREMIUM_TIER) { this.premium_tier = premiumTier; }
    setPremiumSubCount(count: number) { this.premium_subscription_count = count; }
    setApproxMemberCount(count: number) { this.approximate_member_count = count; }
    setApproxPresenceCount(count: number) { this.approximate_presence_count = count; }
}

/**
 * Welcome Screen Structure
 * https://discord.com/developers/docs/resources/guild#welcome-screen-object
 */
class WelcomeScreen {
    description?: string
    welcome_channels: WelcomeScreenChannel[] = [];
}

/**
 * Welcome Screen Channel Structure
 * https://discord.com/developers/docs/resources/guild#welcome-screen-object-welcome-screen-channel-structure
 */
class WelcomeScreenChannel {
    channel_id: string
    description: string
    emoji_id?: string
    emoji_name?: string
}

/**
 * Guild Member structure
 * https://discord.com/developers/docs/resources/guild#guild-member-object
 */
export class GuildMember extends Resource {
    user?: User
    nick?: string
    avatar?: string
    roles: string[] = []; // array of role ids
    joined_at: string // ISO8601 timestamp
    premium_since?: string //ISO8601 timestamp
    deaf: boolean
    mute: boolean
    flags: GUILD_MEMBER_FLAGS = GUILD_MEMBER_FLAGS.DEFAULT;
    pending?: boolean
    permissions?: string
    communication_disabled_until?: string // ISO8601 timestamp

    constructor() {
        super();
    }
    
}
