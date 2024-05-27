/**
 * The core server that runs on a Cloudflare worker.
 */

import { Router } from 'itty-router';
import { verifyKey } from 'discord-interactions';
import { Commands } from './commands.js';
import { JsonResponse } from './templates/app/JsonResponse.js';
import { parseArgs } from './handlers/ArgumentHandler.js';
import { INTERACTION_RESPONSE_TYPE, INTERACTION_TYPE } from './templates/discord/Enums.js';

const router = Router();

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get('/', (request, env) => {
    return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

/**
 * Main route for all requests sent from Discord. All incoming messages will
 * include a JSON payload described here:
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
router.post('/', async (request, env) => {
    const { isValid, interaction } = await server.verifyDiscordRequest(
        request,
        env,
    );
    if (!isValid || !interaction) {
        return new Response('Bad request signature.', { status: 401 });
    }

    if (interaction.type === INTERACTION_TYPE.PING) {
        // The `PING` message is used during the initial webhook handshake, and is
        // required to configure the webhook in the developer portal.
        return new JsonResponse({
            type: INTERACTION_RESPONSE_TYPE.PONG,
        });
    }

    if (interaction.type === INTERACTION_TYPE.APPLICATION_COMMAND ||
        interaction.type === INTERACTION_TYPE.MESSAGE_COMPONENT)
    {
        const args = parseArgs(interaction);
        const commandName = args[0];

        if (!Commands.map.has(commandName)) {
            return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
        }
        const interactionResponse = await Commands.map.get(commandName)?.execute(interaction, env, args);
        return new JsonResponse(interactionResponse);

    }

    console.error('Unknown Type');
    return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});
router.all('*', () => new Response('Not Found.', { status: 404 }));

async function verifyDiscordRequest(request: any, env: any) {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();
    const isValidRequest =
        signature &&
        timestamp &&
        verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
    if (!isValidRequest) {
        return { isValid: false };
    }

    return { interaction: JSON.parse(body), isValid: true };
}

const server = {
    verifyDiscordRequest: verifyDiscordRequest,
    fetch: async function (request: any, env: any) {
        return router.handle(request, env);
    },
};

export default server;
