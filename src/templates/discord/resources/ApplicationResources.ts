import { APPLICATION_FLAGS } from "../Enums.js"
import type { Guild } from "./GuildResources.js"
import type { User } from "./UserResources.js"

/**
 * Application structure
 * https://discord.com/developers/docs/resources/application#application-object
 */
export interface Application {
    id: string
    name: string
    icon?: string
    description: string
    rpc_origins?: string[]
    bot_public: boolean
    bot_require_code_grant: boolean
    bot?: User // Partial User
    terms_of_service_url?: string
    privacy_policy_url?: string
    owner?: User // Partial User
    verify_key?: string
    team?: Team
    guild_id?: string
    guild?: Guild // Partial Guild
    primary_sku_id?: string
    slug?: string
    cover_image?: string
    flags?: APPLICATION_FLAGS
    approximate_guild_count?: number
    redirect_uris?: string[]
    interactions_endpoint_url?: string
    role_connections_verification_url?: string
    tags?: string[]
    install_params?: InstallParams
    custom_install_url?: string
}

/**
 * Team structure
 * https://discord.com/developers/docs/topics/teams#data-models-team-object
 */
interface Team {
    icon?: string
    id: string
    members: TeamMember[]
    name: string
    owner_user_id: string
}

/**
 * Team Member structure
 * https://discord.com/developers/docs/topics/teams#data-models-team-member-object
 */
interface TeamMember {
    membership_state: number
    team_id: string
    user: User // Partial User
    role: string
}

/**
 * Install Params structure
 * https://discord.com/developers/docs/resources/application#install-params-object
 */
interface InstallParams {
    scopes: string[]
    permissions: string
}
