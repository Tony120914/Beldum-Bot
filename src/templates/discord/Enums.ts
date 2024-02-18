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
