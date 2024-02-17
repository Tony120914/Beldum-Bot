import { User } from "./UserResource";

/**
 * Emoji Structure 
 * https://discord.com/developers/docs/resources/emoji#emoji-object
 */
export class Emoji {
    id?: string
    name?: string // can only be null in reaction emoji objects
    roles?: string[] = []; // list of role id
    user?: User
    required_colons?: boolean
    managed?: boolean
    animated?: boolean
    available?: boolean

    constructor(id?: string, name?: string) {
        this.id = id;
        this.name = name;
    }

    addRole(id: string) { this.roles?.push(id); }
    setUser(user: User) { this.user = user; }
    setRequiredColons(isRequired: boolean) { this.required_colons = isRequired; }
    setManaged(isManaged: boolean) { this.managed = isManaged; }
    setAnimated(isAnimated: boolean) { this.animated = isAnimated; }
    setAvailable(isAvailable: boolean) { this.available = isAvailable; }    
}
