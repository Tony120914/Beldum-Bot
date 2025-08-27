import { Emoji } from "../templates/discord/resources/EmojiResources.js";
import { IMAGE_FORMAT, IMAGE_SIZE } from "../templates/discord/Enums.js";
import { buildUrl } from "./Utils.js";

const DISCORD_API_BASE_URL = 'https://discord.com/api/v';
const DISCORD_API_VERSION = '10';
const DISCORD_IMAGE_BASE_URL = 'https://cdn.discordapp.com';

/**
 * Build Discord API URL string.
 * https://discord.com/developers/docs/reference#api-reference
 */
export function buildDiscordAPIUrl(path: string[], query: string[]) {
    const baseUrl = `${DISCORD_API_BASE_URL}${DISCORD_API_VERSION}`;
    const url = buildUrl(baseUrl, path, query);
    return url;
}

/**
 * Build Discord Image URL string.
 * https://discord.com/developers/docs/reference#image-formatting
 */
export function buildDiscordImageUrl(path: string[], format: IMAGE_FORMAT, size: IMAGE_SIZE) {
    if (!path) {
        return DISCORD_IMAGE_BASE_URL;
    }
    const pathCopy = path.slice();
    const lastIndex = pathCopy.length - 1;
    pathCopy[lastIndex] = `${pathCopy[lastIndex]}${format}`;
    const query = [`size=${size}`];
    const url = buildUrl(DISCORD_IMAGE_BASE_URL, pathCopy, query);
    return url;
}

/**
 * Parse Emoji format
 * https://discord.com/developers/docs/reference#message-formatting
 */
export function parseEmoji(format?: string): Emoji | undefined {
    if (!format) { return; }
    const animated = format.match(/<a:/);
    const name = format.match(/(?<=\:)(\w*)(?=\:)/);
    const id = format.match(/(?<=\:)(\d*)(?=\>)/);
    if (!id || !name) { return; }
    const emoji = new Emoji(id[0], name[0]);
    emoji.setAnimated(animated ? true : false);
    return emoji;
}

/**
 * Build Emoji format
 * https://discord.com/developers/docs/reference#message-formatting
 */
export function buildEmoji(emojiName?: string, emojiId?: string, isAnimated?: boolean) {
    const animated = isAnimated ? 'a' : '';
    return `<${animated}:${emojiName}:${emojiId}>`;
}

/**
 * Build Role format
 * https://discord.com/developers/docs/reference#message-formatting
 */
export function buildRole(roleId?: string) {
    if (!roleId) { return; }
    return `<@&${roleId}>`;
}

/**
 * Build User format
 * https://discord.com/developers/docs/reference#message-formatting
 */
export function buildUser(userId?: string) {
    if (!userId) { return; }
    return `<@${userId}>`;
}
