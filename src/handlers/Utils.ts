
/**
 * Get random integer between (inclusive) min and (inclusive) max.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
 */
export function getRandomInt(min: number, max: number) {
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
    for (let i = 0; i < path.length; i++) {
        url += `/${path[i].replace(/\//g, '')}`;
    }
    for (let i = 0; i < query.length; i++) {
        const separator = i == 0 ? '?' : '&';
        url += `${separator}${query[i].replace(/\?/g, '').replace(/\&/g, '')}`;
    }
    return url;
}
