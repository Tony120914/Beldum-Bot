import { ApplicationCommand } from "../discord/ApplicationCommand";

/**
 * Command structure to store application command and its execution function.
 */
export class Command {
    applicationCommand: ApplicationCommand
    execute: Function

    constructor(applicationCommand: ApplicationCommand, execute: Function) {
        this.applicationCommand = applicationCommand;
        this.execute = execute;
    }
}

/**
 * Commands Map<string, Command> structure to handle commands.
 */
export class CommandsMap {
    map: Map<string, Command> = new Map<string, Command>();
    
    addCommand(command: Command) {
        this.map.set(command.applicationCommand.name.toLowerCase(), command);
    }
}
