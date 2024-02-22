
/**
 * Discord's Snowflake
 * https://discord.com/developers/docs/reference#convert-snowflake-to-datetime
 * Do NOT initialize this to store a Snowflake.
 * It is meant to be used to represent a parsed Snowflake.
 */
export class Snowflake {
    snowflake: string
    timestamp: number
    internalWorkerID: number
    internalProcessID: number
    increment: number

    constructor(snowflake: string) {
        this.snowflake = snowflake;
        this.timestamp = Number(BigInt(snowflake) >> 22n) + 1420070400000;
        this.internalWorkerID = Number(BigInt(snowflake) & 0x3E0000n) >> 17;
        this.internalProcessID = Number(BigInt(snowflake) & 0x1F000n) >> 12;
        this.increment = Number(BigInt(snowflake) & 0xFFFn);
    }
}
