import { Commands } from './commands.js';
import dotenv from 'dotenv';
import process from 'node:process';
import { getFetchErrorText } from './handlers/ErrorHandler.js';
import { buildDiscordAPIUrl } from './handlers/MessageHandler.js';

/**
 * This file is meant to be run from the command line, and is not used by the
 * application server. It's allowed to use node.js primitives, and only needs
 * to be run once.
 */

dotenv.config({ path: '.dev.vars' });

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
    throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
    throw new Error(
        'The DISCORD_APPLICATION_ID environment variable is required.',
    );
}

/**
 * Register all commands globally. This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */
const url = buildDiscordAPIUrl(['applications', applicationId, 'commands'], []);
const applicationCommands = Array.from(Commands.map.values()).map(command => command.applicationCommand);
const response = await fetch(url, {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${token}`,
    },
    method: 'PUT',
    body: JSON.stringify(applicationCommands),
});

if (!response.ok) {
    console.error('Error registering commands');
    const errorText = getFetchErrorText(response);
    console.error(errorText);
} else {
    console.log('Registered all commands');
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}
