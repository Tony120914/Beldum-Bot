
/**
 * Parse Snowflake ID into object
 * https://discord.com/developers/docs/reference#convert-snowflake-to-datetime
 */
export function parseSnowflake(snowflake: string) {
    return {
        timestamp: Number(BigInt(snowflake) >> 22n) + 1420070400000,
        internalWorkerID: Number(BigInt(snowflake) & 0x3E0000n) >> 17,
        internalProcessID: Number(BigInt(snowflake) & 0x1F000n) >> 12,
        increment: Number(BigInt(snowflake) & 0xFFFn)
    }
}

/**
 * Get random integer between (inclusive) min and (inclusive) max.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
 */
export function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
}
