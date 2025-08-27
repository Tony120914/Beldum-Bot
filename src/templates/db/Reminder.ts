
/**
 * Structure for User DB Table
 */
export class User {
    userId: string // Primary key
    utcOffset: number

    constructor(userId: string, utcOffset: number) {
        this.userId = userId;
        this.utcOffset = utcOffset;
    }
}

const TTL = 3;
/**
 * Structure for UserReminder DB Table
 */
export class UserReminder {
    rowId!: number // Primary key (auto generated)
    userId: string
    channelId: string
    reminder: string
    reminderDatetime: string // ISO8601
    ttl: number = TTL;

    constructor(userId: string, channelId: string, reminder: string, reminderDatetime: string) {
        this.userId = userId;
        this.channelId = channelId;
        this.reminder = reminder;
        this.reminderDatetime = reminderDatetime;
    }

    setTTL(ttl: number) { this.ttl = ttl; }
}
