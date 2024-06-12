import { UserReminder, User } from "../templates/db/Reminder";

/**
 * Cloudflare D1: serverless SQL DB
 * https://developers.cloudflare.com/d1/
 */

/**
 * Upsert a row to table User
 */
export async function upsertUser(env: any, user: User) {
    const result = await env.DB.prepare(
        'INSERT INTO User (userId, utcOffset)\
        VALUES (?1, ?2)\
        ON CONFLICT(userId)\
        DO UPDATE SET utcOffset=excluded.utcOffset'
    )
    .bind(user.userId, user.utcOffset)
    .run();
    return result;
}

/**
 * Select from table User to get the timezone offset of a user
 */
export async function selectUserField(env: any, userId: string, field: string) {
    const result = await env.DB.prepare(
        'SELECT *\
        FROM User\
        WHERE userId=?1'
    )
    .bind(userId)
    .first(field);
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

/**
 * Select all rows from table UserReminder that contains all reminders of a user
 */
export async function selectUserReminderAll(env: any, userId: string) {
    const result = await env.DB.prepare(
        'SELECT rowid AS rowId, *\
        FROM UserReminder\
        WHERE userId=?1\
        ORDER BY reminderDatetime ASC'
    )
    .bind(userId)
    .all();
    return result;
}

/**
 * Select from table UserReminder to get the count of all reminders of a user
 */
export async function selectUserReminderCount(env: any, userId: string) {
    const result = await env.DB.prepare(
        'SELECT COUNT(*) AS reminderCount\
        FROM UserReminder\
        WHERE userId=?1'
    )
    .bind(userId)
    .first('reminderCount');
    return result;
}

/**
 * Select all expired reminders from table UserReminder
 */
export async function selectUserReminderExpired(env: any) {
    const now = new Date().toISOString();
    const result = await env.DB.prepare(
        'SELECT rowid AS rowId, *\
        FROM UserReminder\
        WHERE (UNIXEPOCH(reminderDatetime) - UNIXEPOCH(?1)) <= 0\
        ORDER BY reminderDatetime ASC'
    )
    .bind(now)
    .all();
    return result;
}

/**
 * Delete from table UserReminder a reminder
 */
export async function deleteUserReminder(env: any, rowId: number) {
    const result = await env.DB.prepare(
        'DELETE FROM UserReminder\
        WHERE rowId=?1'
    )
    .bind(rowId)
    .run();
    return result;
}
