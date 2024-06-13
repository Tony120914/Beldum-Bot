DROP TABLE IF EXISTS User;
CREATE TABLE IF NOT EXISTS User (
    userId TEXT PRIMARY KEY,
    utcOffset INTEGER
);

DROP TABLE IF EXISTS UserReminder;
CREATE TABLE IF NOT EXISTS UserReminder (
    userId TEXT,
    channelId TEXT,
    reminder TEXT,
    reminderDatetime DATETIME,
    ttl INTEGER
);
