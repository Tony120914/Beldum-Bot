import { EightBall } from "./commands/8ball.js";
import { CoinToss } from "./commands/cointoss.js";
import { Help } from "./commands/help.js";
import { Info } from "./commands/info.js";
import { Ping } from "./commands/ping.js";
import { Rng } from "./commands/rng.js";
import { Rps } from "./commands/rps.js";
import { TicTacToe } from "./commands/tictactoe.js";
import { UrbanDictionary } from "./commands/urbandictionary.js";
import { CommandsMap } from "./templates/app/Command.js";

/**
 * Storing all commands as key-value pairs (command name, command object)
 */
export const Commands = new CommandsMap();
Commands.addCommand(EightBall);
Commands.addCommand(CoinToss);
Commands.addCommand(Help);
Commands.addCommand(Info);
Commands.addCommand(Ping);
Commands.addCommand(Rng);
Commands.addCommand(Rps);
Commands.addCommand(TicTacToe);
Commands.addCommand(UrbanDictionary);
