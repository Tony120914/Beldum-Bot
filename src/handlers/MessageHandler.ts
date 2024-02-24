import { Emoji } from "../templates/discord/EmojiResources";
import { IMAGE_FORMAT, IMAGE_SIZE } from "../templates/discord/Enums";
import { apiBaseUrl, apiVersion, imageBaseUrl } from "../../config.json";
import { buildUrl } from "./Utils";

/**
 * Build Discord API URL string.
 * https://discord.com/developers/docs/reference#api-reference
 */
export function buildDiscordAPIUrl(path: string[], query: string[]) {
    const baseUrl = `${apiBaseUrl}${apiVersion}`;
    const url = buildUrl(baseUrl, path, query);
    return url;
}

/**
 * Build Discord Image URL string.
 * https://discord.com/developers/docs/reference#image-formatting
 */
export function buildDiscordImageUrl(path: string[], format: IMAGE_FORMAT, size: IMAGE_SIZE) {
    if (!path) {
        return imageBaseUrl;
    }
    const pathCopy = path.slice();
    const lastIndex = pathCopy.length - 1;
    pathCopy[lastIndex] = `${pathCopy[lastIndex]}${format}`;
    const query = [`size=${size}`];
    const url = buildUrl(imageBaseUrl, pathCopy, query);
    return url;
}

/**
 * Parse Emoji format
 * https://discord.com/developers/docs/reference#message-formatting
 */
export function parseEmoji(format: string): any {
    const animated = format.match(/<a:/);
    const name = format.match(/(?<=\:)(\w*)(?=\:)/);
    const id = format.match(/(?<=\:)(\d*)(?=\>)/);
    if (!id || !name) {
        console.error(`id or name did not match:\nid:${id}\nname:${name}`);
        return;
    }
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
