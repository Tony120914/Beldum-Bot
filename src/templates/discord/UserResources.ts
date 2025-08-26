import { USER_FLAGS, USER_PREMIUM_TYPE } from "./Enums.js"

/** 
 * User Structure 
 * https://discord.com/developers/docs/resources/user#user-object
 */
export interface User {
    id: string
    username: string
    discriminator: string
    global_name?: string
    avatar?: string
    bot?: boolean
    system?: boolean
    mfa_enabled?: boolean
    banner?: string
    accent_color?: number
    locale?: string
    verified?: boolean
    email?: string
    flags?: USER_FLAGS
    premium_type?: USER_PREMIUM_TYPE
    public_flags?: USER_FLAGS
    avatar_decoration?: string
}
