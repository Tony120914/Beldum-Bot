import {
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
    ChannelTypes,
} from 'discord-interactions';

/** Interaction Response Types */
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

/** Interaction Response Mention Permission Types */
export enum ALLOWED_MENTION_TYPES {
    ROLES = 'roles',
    USERS = 'users',
    EVERRYONE = 'everyone',
}

/** Interaction Response Message Flags */
export enum INTERACTION_RESPONSE_FLAGS {
    /** Do not include any embeds */
    SUPPRESS_EMBEDS = 1 << 2,
    /** Response only visible to user to invoked the interaction. */
    EPHEMERAL = InteractionResponseFlags.EPHEMERAL,
}

/** Interaction Response Component Types */
export enum MESSAGE_COMPONENT_TYPES {
    ACTION_ROW = MessageComponentTypes.ACTION_ROW,
    BUTTON = MessageComponentTypes.BUTTON,
    STRING_SELECT = MessageComponentTypes.STRING_SELECT,
    TEXT_INPUT = MessageComponentTypes.INPUT_TEXT,
    USER_SELECT = MessageComponentTypes.USER_SELECT,
    ROLE_SELECT = MessageComponentTypes.ROLE_SELECT,
    MENTIONABLE_SELECT = MessageComponentTypes.MENTIONABLE_SELECT,
    CHANNEL_SELECT = MessageComponentTypes.CHANNEL_SELECT,
}

/** Button Component Styles */
export enum BUTTON_STYLE_TYPES {
    PRIMARY = ButtonStyleTypes.PRIMARY,
    SECONDARY = ButtonStyleTypes.SECONDARY,
    SUCCESS = ButtonStyleTypes.SUCCESS,
    DANGER = ButtonStyleTypes.DANGER,
    LINK = ButtonStyleTypes.LINK,
}

/** Select Menu Default Value Types */
export enum DEFAULT_VALUE_TYPES {
    USER = 'user',
    ROLE = 'role',
    CHANNEL = 'channel',
}

/** Channel Select Types */
export enum CHANNEL_TYPES {
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

/** Text Input Styles */
export enum TEXT_INPUT_STYLES {
    SHORT = 1,
    PARAGRAPH = 2,
}
