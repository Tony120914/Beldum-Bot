import { USER_FLAGS, USER_PREMIUM_TYPE } from "./Enums"

/** 
 * User Structure 
 * https://discord.com/developers/docs/resources/user#user-object
 */
export class User {
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

    constructor(id: string, username: string, discriminator: string) {
        this.id = id;
        this.username = username;
        this.discriminator = discriminator;
    }

    assignObject(object: object) {
        Object.assign(this, object);
    }

    setGlobalName(globalName: string) { this.global_name = globalName; }
    setAvatar(avatar: string) { this.avatar = avatar; }
    setBot(isBot: boolean) { this.bot = isBot; }
    setSystem(isSystem: boolean) { this.system = isSystem; }
    setMfaEnabled(isEnabled: boolean) { this.mfa_enabled = isEnabled; }
    setBanner(banner: string) { this.banner = banner; }
    setAccentColor(color: number) { this.accent_color = color; }
    setLocale(locale: string) { this.locale = locale; }
    setVerified(isVerified: boolean) {this.verified = isVerified; }
    setEmail(email: string) { this.email = email; }
    setFlags(flags: USER_FLAGS) { this.flags = flags; }
    setPremiumType(premium_type: USER_PREMIUM_TYPE) { this.premium_type = premium_type; }
    setPublicFlags(publicFlags: USER_FLAGS) { this.public_flags = publicFlags; }
    setAvatarDecoration(avatarDecoration: string) { this.avatar_decoration = avatarDecoration; }
}
