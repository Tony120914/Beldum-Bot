import { InteractionType } from "discord-interactions";
import { APPLICATION_COMMAND_OPTION_TYPE } from "../templates/discord/Enums";

/**
 * Parse interaction arguments
 */
export function parseArgs(interaction: any) {
    let args: string[] = [];
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        const commandName = interaction.data.name.toLowerCase();
        args.push(commandName);
        interaction.data.options?.forEach(option => {
            if (option.type == APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND ||
                option.type == APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND_GROUP)
            {
                args.push(option.name);
            }
            else {
                args.push(option.value);
            }
        });
    }
    else if (interaction.type === InteractionType.MESSAGE_COMPONENT){
        const commandName = interaction.message.interaction_metadata.name.toLowerCase();
        args = commandName.split(' ');
    }
    return args;
}
