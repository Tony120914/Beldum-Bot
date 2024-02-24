import { ROLE_FLAGS } from "./Enums"
import { Resource } from "./Resource"

/**
 * Role Structure
 * https://discord.com/developers/docs/topics/permissions#role-object
 */
export class Role extends Resource {
    id: string
    name: string
    color: number
    hoist: boolean
    icon?: string
    unicode_emoji?: string
    position: number
    permissions: string
    managed: boolean
    mentionable: boolean
    tags?: RoleTags = new RoleTags();
    flags: ROLE_FLAGS

    constructor(id: string, name: string) {
        super();
        this.id = id;
        this.name = name;
    }

    setColor(color: number) { this.color = color; }
    setHoist(isListed: boolean) { this.hoist = isListed; }
    setIcon(icon: string) { this.icon = icon; }
    setUnicodeEmoji(unicode_emoji: string) { this.unicode_emoji = unicode_emoji; }
    setPosition(position: number) { this.position = position; }
    setPermissions(permissions: string) { this.permissions = permissions; }
    setManaged(isManaged: boolean) { this.managed = isManaged; }
    setMentionable(isMentionable: boolean) { this.mentionable = isMentionable; }
    setFlags(flags: ROLE_FLAGS) { this.flags = flags; }
}

/**
 * Role Tags structure
 * https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure
 */
class RoleTags {
    bot_id?: string
    integration_id?: string
    premium_subscriber?: boolean
    subscription_listing_id?: string
    available_for_purchase?: boolean
    guild_connections?: boolean

    setBotId(bot_id: string) { this.bot_id = bot_id; }
    setIntegrationId(integration_id: string) { this.integration_id = integration_id; }
    setPremiumSubscriber(isPremiumRole: boolean) { this.premium_subscriber = isPremiumRole; }
    setSubscriptionListingId(subscription_listing_id: string) { this.subscription_listing_id = subscription_listing_id; }
    setAvailableForPurchase(isAvailable: boolean) { this.available_for_purchase = isAvailable; }
    setGuildConnections(isLinkedRole: boolean) { this.guild_connections = isLinkedRole; }
}
