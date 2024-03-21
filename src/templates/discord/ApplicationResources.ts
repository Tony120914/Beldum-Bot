import { APPLICATION_FLAGS } from "./Enums"
import { Guild } from "./GuildResources"
import { Resource } from "./Resource"
import { User } from "./UserResources"

/**
 * Application structure
 * https://discord.com/developers/docs/resources/application#application-object
 */
export class Application extends Resource {
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

    constructor(id: string, name: string) {
        super();
        this.id = id;
        this.name = name;
    }
}

/**
 * Team structure
 * https://discord.com/developers/docs/topics/teams#data-models-team-object
 */
class Team {
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
class TeamMember {
    membership_state: number
    team_id: string
    user: User // Partial User
    role: string
}

/**
 * Install Params structure
 * https://discord.com/developers/docs/resources/application#install-params-object
 */
class InstallParams {
    scopes: string[]
    permissions: string
}
