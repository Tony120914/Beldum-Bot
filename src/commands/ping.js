import {
    InteractionResponseType,
    InteractionResponseFlags,
} from 'discord-interactions';
import { JsonResponse } from '../server.js';

export const Ping = {
    name: 'ping',
    description: 'ping desc',

    async execute(env) {
        const applicationId = env.DISCORD_APPLICATION_ID;
        const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=applications.commands`;
        return new JsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: INVITE_URL,
                flags: InteractionResponseFlags.EPHEMERAL,
            },
        });
    }
};
