
/**
 * Discord's Snowflake parser
 * https://discord.com/developers/docs/reference#convert-snowflake-to-datetime
 */
export const SnowflakeParser = {
    getTimestamp(snowflake: string): number {
        return Number(BigInt(snowflake) >> 22n) + 1420070400000;
    },

    getInternalWorkerID(snowflake: string): number {
        return Number(BigInt(snowflake) & 0x3E0000n) >> 17;
    },

    getInternalProcessID(snowflake: string): number {
        return Number(BigInt(snowflake) & 0x1F000n) >> 12;
    },

    getIncrement(snowflake: string): number {
        return Number(BigInt(snowflake) & 0xFFFn);
    },

}
