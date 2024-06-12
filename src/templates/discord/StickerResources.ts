import { IMAGE_FORMAT, STICKER_FORMAT_TYPE, STICKER_TYPE } from "./Enums"
import { User } from "./UserResources"

/**
 * Sticker structure
 * https://discord.com/developers/docs/resources/sticker#sticker-object
 */
export class Sticker {
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

    static formatTypeToString(formatType: STICKER_FORMAT_TYPE) {
        switch(formatType) {
            case STICKER_FORMAT_TYPE.PNG: {
                return IMAGE_FORMAT.PNG;
            }
            case STICKER_FORMAT_TYPE.APNG: {
                return IMAGE_FORMAT.PNG; // APNG is stored as PNG in Discord
            }
            case STICKER_FORMAT_TYPE.LOTTIE: {
                return IMAGE_FORMAT.LOTTIE
            }
            case STICKER_FORMAT_TYPE.GIF: {
                return IMAGE_FORMAT.GIF
            }
            default: {
                return IMAGE_FORMAT.PNG;
            }
        }
    }
}