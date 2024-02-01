import { Ping } from "./commands/ping.js";

// Storing all commands as key-value pairs (command name, command object)
const commands = new Map();
commands.set(Ping.name.toLowerCase(), Ping);

export const Commands = commands;
