import type { Embed } from "../Embed.js"
import type { APPLICATION_INTEGRATION_TYPE, INTERACTION_TYPE, MESSAGE_FLAGS, MESSAGE_TYPES } from "../Enums.js"
import type { Resolved } from "../InteractionReceive.js"
import type { MessageComponent } from "../MessageComponents.js"
import type { Application } from "./ApplicationResources.js"
import type { Attachment, Channel } from "./ChannelResources.js"
import type { Role } from "./PermissionsResources.js"
import type { Sticker } from "./StickerResources.js"
import type { User } from "./UserResources.js"

/**
 * Message Resource Object
 * https://discord.com/developers/docs/resources/message#message-object
 */
export interface Message {
    id: string
    channel_id: string
    author: User
    content: string
    timestamp: Date
    edited_timestamp: Date
    tts: boolean
    mention_everyone: boolean
    mentions: User[] 
    mention_roles: Role[]
    mention_channels?: ChannelMention
    attachments: Attachment[]
    embeds: Embed[]
    reactions?: Reaction[]
    nonce?: number | string
    pinned: boolean
    webhook_id?: string
    type: MESSAGE_TYPES
    activity?: MessageActivity
    application?: Application // partial
    application_id?: string
    flags?: MESSAGE_FLAGS
    message_reference?: MessageReference
    message_snapshots?: MessageSnapshot[]
    referenced_message?: Message
    interaction_metadata?: MessageInteractionMetadata
    thread?: Channel
    components?: MessageComponent[]
    sticker_items?: Sticker[]
    position?: number
    role_subscription_data?: RoleSubscriptionData
    resolved?: Resolved
    poll?: Poll
    call?: MessageCall
}

/**
 * https://discord.com/developers/docs/resources/message#channel-mention-object
 */
interface ChannelMention {
    // TODO: do when needed
}

/**
 * https://discord.com/developers/docs/resources/message#reaction-object
 */
interface Reaction {
    // Todo: do when needed
}

/**
 * https://discord.com/developers/docs/resources/message#message-object-message-activity-structure
 */
interface MessageActivity {

}

/**
 * https://discord.com/developers/docs/resources/message#message-reference-structure
 */
interface MessageReference {

}

/**
 * https://discord.com/developers/docs/resources/message#message-snapshot-object
 */
interface MessageSnapshot {

}

/**
 * Parent interface for Message Interaction Metadata, includes:
 * Application Command Interaction Metadata
 * Message Component Interation Metadata
 * Modal Submit Interaction Metadata
 * https://discord.com/developers/docs/resources/message#message-interaction-metadata-object
 */
export interface MessageInteractionMetadata extends ApplicationCommandInteractionMetadata, MessageComponentInteractionMetadata, ModalSubmitInteractionMetadata {
    name?: string // not in Discord docs???
}

/**
 * Application Command Interaction Metadata
 * https://discord.com/developers/docs/resources/message#message-interaction-metadata-object-application-command-interaction-metadata-structure
 */
interface ApplicationCommandInteractionMetadata {
    id: string
    type: INTERACTION_TYPE
    user: User
    authorizing_integration_owners: Record<APPLICATION_INTEGRATION_TYPE, string>
    original_response_message_id?: string
    target_user?: User
    target_message_id?: string
}

/**
 * Message Component Interaction Metadata
 * https://discord.com/developers/docs/resources/message#message-interaction-metadata-object-message-component-interaction-metadata-structure
 */
interface MessageComponentInteractionMetadata {
    id: string
    type: INTERACTION_TYPE
    user: User
    authorizing_integration_owners: Record<APPLICATION_INTEGRATION_TYPE, string>
    original_response_message_id?: string
    interacted_message_id: string
}

/**
 * Modal Submit Interaction Metadata
 * https://discord.com/developers/docs/resources/message#message-interaction-metadata-object-modal-submit-interaction-metadata-structure
 */
interface ModalSubmitInteractionMetadata {
    id: string
    type: INTERACTION_TYPE
    user: User
    authorizing_integration_owners: Record<APPLICATION_INTEGRATION_TYPE, string>
    original_response_message_id?: string
    triggering_interaction_metadata: MessageInteractionMetadata
}

/**
 * https://discord.com/developers/docs/resources/message#role-subscription-data-object
 */
interface RoleSubscriptionData {

}

/**
 * https://discord.com/developers/docs/resources/poll#poll-object
 */
interface Poll {

}

/**
 * https://discord.com/developers/docs/resources/message#message-call-object
 */
interface MessageCall {

}
