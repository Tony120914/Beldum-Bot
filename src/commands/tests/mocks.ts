import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import type { Interaction } from "../../templates/discord/InteractionReceive.js"
import { APPLICATION_INTEGRATION_TYPE, INTERACTION_CONTEXT_TYPE, INTERACTION_TYPE } from "../../templates/discord/Enums.js"
import { afterAll, afterEach, beforeAll } from 'vitest';

export const mockInteraction: Interaction = {
    id: '',
    application_id: '',
    type: INTERACTION_TYPE.APPLICATION_COMMAND,
    data: undefined,
    guild: undefined,
    guild_id: '',
    channel: undefined,
    channel_id: '',
    member: undefined,
    user: undefined,
    token: '',
    version: 1,
    message: undefined,
    app_permissions: '',
    locale: '',
    guild_locale: '',
    entitlements: [],
    authorizing_integration_owners: {
        [APPLICATION_INTEGRATION_TYPE.GUILD_INSTALL]: '',
        [APPLICATION_INTEGRATION_TYPE.USER_INSTALL]: ''
    },
    context: INTERACTION_CONTEXT_TYPE.GUILD,
    attachment_size_limit: 10485760
}

export const mockEnv: Env = {
    DISCORD_APPLICATION_ID: '222222222222222222',
    DISCORD_PUBLIC_KEY: 'mockDiscordPublicKey',
    DISCORD_TOKEN: 'mockDiscordToken',
    INTERACTIONS_ENDPOINT: 'https://mockInteractionsEndpoint.com/',
    TOPGG_TOKEN: 'mockTopGGToken',
    USER_AGENT: 'mockUserAgent (https://mockURL.com/, 1.0)',
    // @ts-ignore
    DB: undefined
}

const mockHttpHandlers = [
    http.get(mockEnv.INTERACTIONS_ENDPOINT, () => {
        return HttpResponse.json({});
    }),
    http.get('http://api.urbandictionary.com/v0/define', () => {
        return HttpResponse.json(
            {
            "list": [
                {
                "author": "name",
                "current_vote": "",
                "defid": 11111111,
                "definition": "definition",
                "example": "example",
                "permalink": "https://www.urbandictionary.com/define.php?term=term&defid=11111111",
                "thumbs_down": 111,
                "thumbs_up": 222,
                "word": "term",
                "written_on": "2000-01-01T01:01:01.001Z"
                },
                {
                "author": "random internet name",
                "current_vote": "",
                "defid": 22222222,
                "definition": "the definition of some word",
                "example": "usage example of the word",
                "permalink": "https://www.urbandictionary.com/define.php?term=word&defid=22222222",
                "thumbs_down": 52,
                "thumbs_up": 561,
                "word": "word",
                "written_on": "2000-01-01T01:01:01.001Z"
                },
            ]
        });
    }),
];

const server = setupServer(...mockHttpHandlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
