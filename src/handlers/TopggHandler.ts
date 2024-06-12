import { Application } from "../templates/discord/ApplicationResources";
import { getFetchErrorText } from "./ErrorHandler";
import { buildDiscordAPIUrl } from "./MessageHandler";
import { buildUrl } from "./Utils";

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
    const discordData = await discordResponse.json();
    const application = new Application(discordData.id, discordData.name);
    Object.assign(application, discordData);
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
