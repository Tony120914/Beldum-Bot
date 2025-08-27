import { STICKER_FORMAT_TYPE, STICKER_TYPE } from "../Enums.js"
import type { User } from "./UserResources.js"

/**
 * Sticker structure
 * https://discord.com/developers/docs/resources/sticker#sticker-object
 */
export interface Sticker {
    id: string
    pack_id?: string
    name: string
    description?: string
    tags: string
    type: STICKER_TYPE
    format_type: STICKER_FORMAT_TYPE
    available?: boolean
    guild_id?: string
    user?: User
    sort_value?: number
}
