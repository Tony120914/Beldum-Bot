import { ROLE_FLAGS } from "./Enums.js"

/**
 * Role Structure
 * https://discord.com/developers/docs/topics/permissions#role-object
 */
export interface Role {
    id: string
    name: string
    colors: RoleColors
    hoist: boolean
    icon?: string
    unicode_emoji?: string
    position: number
    permissions: string
    managed: boolean
    mentionable: boolean
    tags?: RoleTags
    flags: ROLE_FLAGS
}

/**
 * Role Tags structure
 * https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure
 */
interface RoleTags {
    bot_id?: string
    integration_id?: string
    premium_subscriber?: boolean
    subscription_listing_id?: string
    available_for_purchase?: boolean
    guild_connections?: boolean
}

/**
 * Role Colors object
 * https://discord.com/developers/docs/topics/permissions#role-object-role-colors-object
 */
interface RoleColors {
    primary_color: number
    secondary_color?: number
    tertiary_color?: number
}
