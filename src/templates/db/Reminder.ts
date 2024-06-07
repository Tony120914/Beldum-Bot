
/**
 * Structure for UserTimezone DB Table
 */
export class UserTimezone {
    userId: string
    utcOffset: number

    constructor(userId: string, utcOffset: number) {
        this.userId = userId;
        this.utcOffset = utcOffset;
    }
}

/**
 * Structure for UserReminder DB Table
 */
export class UserReminder {
    userId: string
    channelId: string
    reminder: string
    reminderDatetime: string // ISO8601

    constructor(userId: string, channelId: string, reminder: string, reminderDatetime: string) {
        this.userId = userId;
        this.channelId = channelId;
        this.reminder = reminder;
        this.reminderDatetime = reminderDatetime;
    }
}
