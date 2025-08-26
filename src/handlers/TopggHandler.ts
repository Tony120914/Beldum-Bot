import type { Application } from "../templates/discord/ApplicationResources.js";
import { getFetchErrorText } from "./ErrorHandler.js";
import { buildDiscordAPIUrl } from "./MessageHandler.js";
import { buildUrl } from "./Utils.js";

const BASE_URL = 'https://top.gg/api';
const BOT_ID = '454764425090433034';

export async function postServerCount(env: any) {
    // Get server count from Discord API
    const discordHeaders = {
        'Content-Type': 'application/json',
        'User-Agent': env.USER_AGENT,
        'Authorization': `Bot ${env.DISCORD_TOKEN}`,
    }
    const discordUrl = buildDiscordAPIUrl(['applications', '@me'], []);
    const discordResponse = await fetch(discordUrl, {
        headers: discordHeaders
    });
    if (!discordResponse.ok) {
        const error = await getFetchErrorText(discordResponse);
        console.error(error);
        return;
    }
    const application : Application = await discordResponse.json();
    const serverCount = application.approximate_guild_count;
    
    // Post server count to Top.gg API
    const topggHeaders = {
        'Content-Type': 'application/json',
        'User-Agent': env.USER_AGENT,
        'Authorization': env.TOPGG_TOKEN,
    };
    const topggBody = {
        'server_count': serverCount
    };
    const topggUrl = buildUrl(BASE_URL, ['bots', BOT_ID, 'stats'], []);
    const topggResponse = await fetch(topggUrl, {
        headers: topggHeaders,
        method: 'POST',
        body: JSON.stringify(topggBody)
    });
    if (!topggResponse.ok) {
        const error = await getFetchErrorText(topggResponse);
        console.error(error);
        return;
    }
    else {
        console.log(`Posted server count to Top.gg: ${serverCount}`);
    }
}
