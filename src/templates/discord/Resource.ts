
/**
 * Parent Resource class
 */
export abstract class Resource {
    assignObject(object: object) {
        Object.assign(this, object);
    }
}
