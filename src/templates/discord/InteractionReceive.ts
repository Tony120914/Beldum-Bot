import type { INTERACTION_TYPE, APPLICATION_INTEGRATION_TYPE, INTERACTION_CONTEXT_TYPE, APPLICATION_COMMAND_TYPE, MESSAGE_COMPONENT_TYPE, APPLICATION_COMMAND_OPTION_TYPE } from "./Enums.js"
import type { Guild, GuildMember } from "./resources/GuildResources.js"
import type { Entitlement } from "./resources/EntitlementResources.js"
import type { User } from "./resources/UserResources.js"
import type { Role } from "./resources/PermissionsResources.js"
import type { Attachment, Channel } from "./resources/ChannelResources.js"
import type { Message } from "./resources/MessageResources.js"
import type { ModalData } from "./InteractionResponse.js"

/**
 * Interaction object structure
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-data-structure
 */
export interface Interaction {
    id: string
    application_id: string
    type: INTERACTION_TYPE
    data?: InteractionDataPayload
    guild?: Guild // partial
    guild_id?: string
    channel?: Channel // partial
    channel_id?: string
    member?: GuildMember
    user?: User
    token: string
    readonly version: number // always 1
    message?: Message
    app_permissions: string
    locale?: string // not available for PING type
    guild_locale?: string
    entitlements: Entitlement[]
    authorizing_integration_owners: Record<APPLICATION_INTEGRATION_TYPE, string> // https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-authorizing-integration-owners-object
    context?: INTERACTION_CONTEXT_TYPE
    attachment_size_limit: number
}

/**
 * Parent Interaction Data Payload interface, includes:
 * Application Commands
 * Message Components
 * Application Command Autocomplete
 * Modal Submit
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data
 */
export interface InteractionDataPayload extends InteractionApplicationCommand, InteractionApplicationCommandAutocomplete, InteractionMessageComponent, InteractionModalSubmit {
}

/**
 * Interaction received from Application Command object
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-data-structure
 */
interface InteractionApplicationCommand {
    id: string
    name: string
    type: APPLICATION_COMMAND_TYPE
    resolved?: Resolved
    options?: ApplicationCommandInteractionDataOption[]
    guild_id?: string
    target_id?: string
}

/**
 * Interaction received from Application Command Autocomplete object
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-data-structure
 */
interface InteractionApplicationCommandAutocomplete {
    // partial of InteractionApplicationCommand
    id: string
    name: string
    type: APPLICATION_COMMAND_TYPE
    resolved?: Resolved
    options?: ApplicationCommandInteractionDataOption[]
    guild_id?: string
    target_id?: string
}

/**
 * Interaction received from Message Component object
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-message-component-data-structure
 */
interface InteractionMessageComponent {
    custom_id: string
    component_type: MESSAGE_COMPONENT_TYPE
    values?: string[] // docs say it's an array of select option values???
    resolved?: Resolved
}

/**
 * Interaction received from Modal Submit object
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-modal-submit-data-structure
 */
interface InteractionModalSubmit {
    custom_id: string
    components: ModalData[]
}

/**
 * Resolved object
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure
 */
export interface Resolved {
    users?: Record<string, User>
    members?: Record<string, GuildMember> // partial
    roles?: Record<string, Role>
    channels?: Record<string, Channel> // partial
    messages?: Record<string, Message>
    attachments?: Record<string, Attachment>
}

/**
 * Application Command Interaction Data Option object
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-interaction-data-option-structure
 */
interface ApplicationCommandInteractionDataOption {
    name: string
    type: APPLICATION_COMMAND_OPTION_TYPE
    value?: string | number | boolean
    options?: ApplicationCommandInteractionDataOption[]
    focused?: boolean
}
