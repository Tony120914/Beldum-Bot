import {
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
    ChannelTypes,
} from 'discord-interactions';

/**
 * Application Command Types
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types
 */
export enum APPLICATION_COMMAND_TYPE {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3,
}

/**
 * Application Command Option Types
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
 */
export enum APPLICATION_COMMAND_OPTION_TYPE {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11
}

/**
 * Interaction Response Types
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type
 */
export enum INTERACTION_RESPONSE_TYPE {
    /** ACK a ping */
    PONG = InteractionResponseType.PONG,
    /** Simple message response */
    CHANNEL_MESSAGE_WITH_SOURCE = InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    /** ACK an interaction and edit later. The user sees a loading state. */
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    /** ACK an interaction and edit later. The user does NOT see a loading state. COMPONENTS ONLY. */
    DEFERRED_UPDATE_MESSAGE = InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
    /** Edit the message the component was attached to. COMPONENTS ONLY. */
    UPDATE_MESSAGE = InteractionResponseType.UPDATE_MESSAGE,
    /** Response to an autocomplete interaction with suggested choices. */
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    /** Response to a popup modal. NOT available for MODAL_SUBMIT and PING interactions. */
    MODAL = InteractionResponseType.MODAL,
    /** Response to an upgrade button. MONETIZED APPS ONLY. */
    PREMIUM_REQUIRED = 10,
}

/**
 * Interaction Response Mention Permission Types
 * https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mention-types
 */
export enum ALLOWED_MENTION_TYPE {
    ROLES = 'roles',
    USERS = 'users',
    EVERYONE = 'everyone',
}

/**
 * Interaction Response Message Flags
 * https://discord.com/developers/docs/resources/channel#message-object-message-flags
 */
export enum INTERACTION_RESPONSE_FLAGS {
    /** Do not include any embeds */
    SUPPRESS_EMBEDS = 1 << 2,
    /** Response only visible to user to invoked the interaction. */
    EPHEMERAL = InteractionResponseFlags.EPHEMERAL,
}

/**
 * Interaction Response Component Types
 * https://discord.com/developers/docs/interactions/message-components#component-object-component-types
 */
export enum MESSAGE_COMPONENT_TYPE {
    ACTION_ROW = MessageComponentTypes.ACTION_ROW,
    BUTTON = MessageComponentTypes.BUTTON,
    STRING_SELECT = MessageComponentTypes.STRING_SELECT,
    TEXT_INPUT = MessageComponentTypes.INPUT_TEXT,
    USER_SELECT = MessageComponentTypes.USER_SELECT,
    ROLE_SELECT = MessageComponentTypes.ROLE_SELECT,
    MENTIONABLE_SELECT = MessageComponentTypes.MENTIONABLE_SELECT,
    CHANNEL_SELECT = MessageComponentTypes.CHANNEL_SELECT,
}

/**
 * Button Component Styles
 * https://discord.com/developers/docs/interactions/message-components#button-object-button-styles
 */
export enum BUTTON_STYLE {
    PRIMARY = ButtonStyleTypes.PRIMARY,
    SECONDARY = ButtonStyleTypes.SECONDARY,
    SUCCESS = ButtonStyleTypes.SUCCESS,
    DANGER = ButtonStyleTypes.DANGER,
    LINK = ButtonStyleTypes.LINK,
}

/**
 * Select Menu Default Value Types
 * https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-default-value-structure
 */
export enum DEFAULT_VALUE_TYPE {
    USER = 'user',
    ROLE = 'role',
    CHANNEL = 'channel',
}

/**
 * Channel Select Types
 * https://discord.com/developers/docs/resources/channel#channel-object-channel-types
 */
export enum CHANNEL_TYPE {
    GUILD_TEXT = ChannelTypes.GUILD_TEXT,
    DM = ChannelTypes.DM,
    GUILD_VOICE = ChannelTypes.GUILD_VOICE,
    GROUP_DM = ChannelTypes.GROUP_DM,
    GUILD_CATEGORY = ChannelTypes.GUILD_CATEGORY,
    GUILD_ANNOUNCEMENT = ChannelTypes.GUILD_ANNOUNCEMENT,
    ANNOUNCEMENT_THREAD = 10,
    PUBLIC_THREAD = 11,
    PRIVATE_THREAD = 12,
    GUILD_STAGE_VOICE = 13,
    GUILD_DIRECTORY = 14,
    GUILD_FORUM = 15,
    GUILD_MEDIA = 16,
}

/**
 * Text Input Styles
 * https://discord.com/developers/docs/interactions/message-components#text-input-object-text-input-styles
 */
export enum TEXT_INPUT_STYLE {
    SHORT = 1,
    PARAGRAPH = 2,
}

/**
 * User Flags
 * https://discord.com/developers/docs/resources/user#user-object-user-flags
 */
export enum USER_FLAGS {
    STAFF = 1<<0,
    PARTNER = 1<<1,
    HYPESQUAD = 1<<2,
    BUG_HUNTER_LEVEL_1 = 1<<3,
    HYPERSQUAD_ONLINE_HOUSE_1 = 1<<6,
    HYPERSQUAD_ONLINE_HOUSE_2 = 1<<7,
    HYPERSQUAD_ONLINE_HOUSE_3 = 1<<8,
    PREMIUM_EARLY_SUPPORT = 1<<9,
    TEAM_PSEUDO_USER = 1<<10,
    BUG_HUNTER_LEVEL_2 = 1<<14,
    VERIFIED_BOT = 1<<16,
    VERIFIED_DEVELOPER = 1<<17,
    CERIFIED_MODERATOR = 1<<18,
    BOT_HTTP_INTERACTIONS = 1<<19,
    ACTIVE_DEVELOPER = 1<<22,
}

/**
 * User Premium Types
 * https://discord.com/developers/docs/resources/user#user-object-premium-types
 */
export enum USER_PREMIUM_TYPE {
    NONE = 0,
    NITRO_CLASSIC = 1,
    NITRO = 2,
    NITRO_BASIC = 3,
}

/**
 * Attachment Flags
 * https://discord.com/developers/docs/resources/channel#attachment-object-attachment-flags
 */
export enum ATTACHMENT_FLAGS {
    IS_REMIX = 1<<2,
}

/**
 * Image Formats
 * https://discord.com/developers/docs/reference#image-formatting-image-formats
 */
export enum IMAGE_FORMAT {
    JPEG = '.jpg',
    PNG = '.png',
    APNG = '.apng', // for stickers
    WEBP = '.webp',
    GIF = '.gif',
    LOTTIE = '.json',
}

/**
 * Image Sizes
 * https://discord.com/developers/docs/reference#image-formatting
 */
export enum IMAGE_SIZE {
    XXX_SMALL = 2 << 3,
    XX_SMALL = 2 << 4,
    X_SMALL = 2 << 5,
    SMALL = 2 << 6,
    MEDIUM = 2 << 7,
    LARGE = 2 << 8,
    X_LARGE = 2 << 9,
    XX_LARGE = 2 << 10,
    XXX_LARGE = 2 << 11,
}

/**
 * Role Flags
 * https://discord.com/developers/docs/topics/permissions#role-object-role-flags
 */
export enum ROLE_FLAGS {
    IN_PROMPT = 1 << 0,
}

/**
 * Guild Verfication Levels
 * https://discord.com/developers/docs/resources/guild#guild-object-verification-level
 */
export enum VERIFICATION_LEVEL {
    NONE = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    VERY_HIGH = 4,
}

/**
 * Guild Default Message Notification Levels
 * https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level
 */
export enum DEFAULT_MESSAGE_NOTIFICATION_LEVEL {
    ALL_MESSAGES = 0,
    ONLY_MENTIONS = 1,
}

/**
 * Explicit Content Filter Levels
 * https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level
 */
export enum EXPLICIT_CONTENT_FILTER_LEVEL {
    DISABLED = 0,
    MEMBERS_WITHOUT_ROLES = 1,
    ALL_MEMBERS = 2,
}

/**
 * Guild Features
 * https://discord.com/developers/docs/resources/guild#guild-object-guild-features
 */
export enum GUILD_FEATURE {
    ANIMATED_BANNER = 'ANIMATED_BANNER',
    ANIMATED_ICON = 'ANIMATED_ICON',
    APPLICATION_COMMAND_PERMISSIONS_V2 = 'APPLICATION_COMMAND_PERMISSIONS_V2',
    AUTO_MODERATION = 'AUTO_MODERATION',
    BANNER = 'BANNER',
    COMMUNITY = 'COMMUNITY', // Mutable Guild Feature
    CREATOR_MONETIZABLE_PROVISIONAL = 'CREATOR_MONETIZABLE_PROVISIONAL',
    CREATOR_STORE_PAGE = 'CREATOR_STORE_PAGE',
    DEVELOPER_SUPPORT_SERVER = 'DEVELOPER_SUPPORT_SERVER',
    DISCOVERABLE = 'DISCOVERABLE', // Mutable Guild Feature
    FEATURABLE = 'FEATURABLE',
    INVITES_DISABLED = 'INVITES_DISABLED', // Mutable Guild Feature
    INVITE_SPLASH = 'INVITE_SPLASH',
    MEMBER_VERIFICATION_GATE_ENABLED = 'MEMBER_VERIFICATION_GATE_ENABLED',
    MORE_STICKERS = 'MORE_STICKERS',
    NEWS = 'NEWS',
    PARTNERED = 'PARTNERED',
    PREVIEW_ENABLED = 'PREVIEW_ENABLED',
    RAID_ALERTS_DISABLED = 'RAID_ALERTS_DISABLED', // Mutable Guild Feature
    ROLE_ICONS = 'ROLE_ICONS',
    ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE = 'ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE',
    ROLE_SUBSCRIPTIONS_ENABLED = 'ROLE_SUBSCRIPTIONS_ENABLED',
    TICKETED_EVENTS_ENABLED = 'TICKETED_EVENTS_ENABLED',
    VANITY_URL = 'VANITY_URL',
    VERIFIED = 'VERIFIED',
    VIP_REGIONS = 'VIP_REGIONS',
    WELCOME_SCREEN_ENABLED = 'WELCOME_SCREEN_ENABLED',
}

/**
 * Guild MFA Level
 * https://discord.com/developers/docs/resources/guild#guild-object-mfa-level
 */
export enum MFA_LEVEL {
    NONE = 0,
    ELEVATED = 1,
}

/**
 * Guild System Channel Flags
 * https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags
 */
export enum SYSTEM_CHANNEL_FLAGS {
    SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
    SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1,
    SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 1 << 2,
    SUPPRESS_JOIN_NOTIFICATION_REPLIES = 1 << 3,
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS = 1 << 4,
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES = 1 << 5,
}

/**
 * Guild Premium Tiers
 * https://discord.com/developers/docs/resources/guild#guild-object-premium-tier
 */
export enum PREMIUM_TIER {
    NONE = 0,
    TIER_1 = 1,
    TIER_2 = 2,
    TIER_3 = 3,
}

/**
 * Guild NSFW Levels
 * https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level
 */
export enum NSFW_LEVEL {
    DEFAULT = 0,
    EXPLICIT = 1,
    SAFE = 2,
    AGE_RESTRICTED = 3,
}

/**
 * Channel Flags
 * https://discord.com/developers/docs/resources/channel#channel-object-channel-flags
 */
export enum CHANNEL_FLAGS {
    PINNED = 1 << 1,
    REQUIRE_TAG = 1 << 4,
    HIDE_MEDIA_DOWNLOAD_OPTIONS = 1 << 15,
}

/**
 * Guild Member Flags
 * https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-flags
 */
export enum GUILD_MEMBER_FLAGS {
    DEFAULT = 0,
    DID_REJOIN = 1 << 0,
    COMPLETED_ONBOARDING = 1 << 1,
    BYPASSES_VERIFICATION = 1 << 2,
    STARTED_ONBOARDING = 1 << 3,
}

/**
 * Application Flags
 * https://discord.com/developers/docs/resources/application#application-object-application-flags
 */
export enum APPLICATION_FLAGS {
    APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE = 1 << 6,
    GATEWAY_PRESENCE = 1 << 12,
    GATEWAY_PRESENCE_LIMITED = 1 << 13,
    GATEWAY_GUILD_MEMBERS = 1 << 14,
    GATEWAY_GUILD_MEMBERS_LIMITED = 1 << 15,
    VERIFICATION_PENDING_GUILD_LIMIT = 1 << 16,
    EMBEDDED = 1 << 17,
    GATEWAY_MESSAGE_CONTENT = 1 << 18,
    GATEWAY_MESSAGE_CONTENT_LIMITED = 1 << 19,
    APPLICATION_COMMAND_BADGE = 1 << 23,
}

/**
 * Sticker Types
 * https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-types
 */
export enum STICKER_TYPE {
    STANDARD = 1,
    GUILD = 2,
}

/**
 * Sticker Format Types
 * https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-format-types
 */
export enum STICKER_FORMAT_TYPE {
    PNG = 1,
    APNG = 2,
    LOTTIE = 3,
    GIF = 4,
}
