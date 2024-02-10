
/** Emoji Structure */
export class Emoji {
    id?: string
    name?: string // can only be null in reaction emoji objects
    roles?: Role[] = [];
    user?: User = new User();
    required_colons?: boolean
    managed?: boolean
    animated?: boolean
    available?: boolean

    //TODO
}

/** Role Structure */
export class Role {
    //TODO
}

/** User Structure */
export class User {
    //TODO
}