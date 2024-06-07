DROP TABLE IF EXISTS UserTimezone;
CREATE TABLE IF NOT EXISTS UserTimezone (
    userId TEXT PRIMARY KEY,
    utcOffset INTEGER
);

DROP TABLE IF EXISTS UserReminder;
CREATE TABLE IF NOT EXISTS UserReminder (
    userId TEXT,
    channelId TEXT,
    reminder TEXT,
    reminderDatetime DATETIME
);
