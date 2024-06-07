import { UserReminder, UserTimezone } from "../templates/db/Reminder";

/**
 * Select a row from table UserTimezone that contains a user's timezone offset
 */
export async function selectUserTimezone(env: any, userId: string) {
    const result = await env.DB.prepare(
        'SELECT *\
        FROM UserTimezone\
        WHERE userId=?1'
    )
    .bind(userId)
    .first('utcOffset');
    return result;
}

/**
 * Upsert a row to table UserTimezone
 */
export async function upsertUserTimezone(env: any, userTimezone: UserTimezone) {
    const result = await env.DB.prepare(
        'INSERT INTO UserTimezone (userId, utcOffset)\
        VALUES (?1, ?2)\
        ON CONFLICT(userId)\
        DO UPDATE SET utcOffset=excluded.utcOffset'
    )
    .bind(userTimezone.userId, userTimezone.utcOffset)
    .run();
    return result;
}

/**
 * Select all rows from table UserReminder that contains all reminders of a user
 */
export async function selectUserReminders(env: any, userId: string) {
    const result = await env.DB.prepare(
        'SELECT *\
        FROM UserReminder\
        WHERE userId=?1'
    )
    .bind(userId)
    .all();
    return result;
}

/**
 * Insert to table UserReminder
 */
export async function insertUserReminder(env: any, reminder: UserReminder) {
    const result = await env.DB.prepare(
        'INSERT INTO UserReminder (userId, channelId, reminder, reminderDatetime)\
        VALUES (?1, ?2, ?3, ?4)'
    )
    .bind(reminder.userId, reminder.channelId, reminder.reminder, reminder.reminderDatetime)
    .run();
    return result;
}
