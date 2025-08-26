import { IMAGE_FORMAT, STICKER_FORMAT_TYPE } from "../templates/discord/Enums.js";

/**
 * Get random integer between (inclusive) min and (inclusive) max.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
 */
export function getRandomInt(min: number, max: number): number {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
}

/**
 * Build a URL
 * {baseUrl}/{path[0]}/{path[1]}/.../{path[n]}?{query[0]}&{query[1]}&...&{query[n]}
 */
export function buildUrl(baseUrl: string, path: string[], query: string[]) {
    let url = baseUrl.replace(/\/$/g, '');
    for (const segment of path) {
        url += `/${segment.replace(/\//g, '')}`;
    }
    for (const [i, parameter] of query.entries()) {
        const separator = i == 0 ? '?' : '&';
        url += `${separator}${parameter.replace(/\?/g, '').replace(/\&/g, '')}`;
    }
    return url;
}

/**
 * Returns the string ".<formatType>" of a STICKER_FORMAT_TYPE
 */
export function formatTypeToString(formatType: STICKER_FORMAT_TYPE) {
    switch(formatType) {
        case STICKER_FORMAT_TYPE.PNG: {
            return IMAGE_FORMAT.PNG;
        }
        case STICKER_FORMAT_TYPE.APNG: {
            return IMAGE_FORMAT.PNG; // APNG is stored as PNG in Discord
        }
        case STICKER_FORMAT_TYPE.LOTTIE: {
            return IMAGE_FORMAT.LOTTIE
        }
        case STICKER_FORMAT_TYPE.GIF: {
            return IMAGE_FORMAT.GIF
        }
        default: {
            return IMAGE_FORMAT.PNG;
        }
    }
}
