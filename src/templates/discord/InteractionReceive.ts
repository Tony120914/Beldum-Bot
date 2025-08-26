import type { MessageComponentTypes, StringSelectOption } from "discord-interactions"
import type { INTERACTION_TYPE, APPLICATION_INTEGRATION_TYPE, INTERACTION_CONTEXT_TYPE, APPLICATION_COMMAND_TYPE } from "./Enums.js"
import type { Guild, GuildMember } from "./GuildResources.js"
import type { ModalData } from "./InteractionResponse.js"
import type { Entitlement } from "./EntitlementResources.js"
import type { User } from "./UserResources.js"
import type { Role } from "./PermissionsResources.js"
import type { Attachment, Channel } from "./ChannelResources.js"
import type { Message } from "./MessageResources.js"

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
 * Application Commands, Message Components, Application Command Autocomplete, Modal Submit
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data
 */
export interface InteractionDataPayload {
}

/**
 * Interaction received from Application Command object
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-data-structure
 */
export interface InteractionApplicationCommand extends InteractionDataPayload {
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
export interface InteractionApplicationCommandAutocomplete extends InteractionApplicationCommand {
    // partial of InteractionApplicationCommand
}

/**
 * Interaction received from Message Component object
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-message-component-data-structure
 */
export interface InteractionMessageComponent extends InteractionDataPayload {
    custom_id: string
    component_type: MessageComponentTypes
    values?: StringSelectOption[]
    resolved?: Resolved
}

/**
 * Interaction received from Message Component object
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-modal-submit-data-structure
 */
export interface InteractionMessageComponent extends InteractionDataPayload {
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
export interface ApplicationCommandInteractionDataOption {
    // TODO when needed
}

