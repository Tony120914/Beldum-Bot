import { EightBall } from "./commands/8ball.js";
import { Info } from "./commands/info.js";
import { Ping } from "./commands/ping.js";
import { CommandsMap } from "./templates/app/Command.js";

/**
 * Storing all commands as key-value pairs (command name, command object)
 */
export const Commands = new CommandsMap();
Commands.addCommand(EightBall);
Commands.addCommand(Info);
Commands.addCommand(Ping);
