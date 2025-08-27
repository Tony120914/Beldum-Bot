import { APPLICATION_COMMAND_OPTION_TYPE, INTERACTION_TYPE } from "../templates/discord/Enums.js";
import type { Interaction } from "../templates/discord/InteractionReceive.js";

/**
 * Parse interaction arguments
 */
export function parseArgs(interaction: Interaction) {
    let args: string[] = [];
    if (interaction.type === INTERACTION_TYPE.APPLICATION_COMMAND) {
        const data = interaction.data;
        const commandName = data?.name.toLowerCase();
        if (!commandName) { throw new Error(`Empty command prompt from interaction.type: ${interaction.type}`); }
        args.push(commandName);
        let options = data?.options;
        while (Array.isArray(options) && options.length != 0) {
            options.forEach(option => {
                if (option.type == APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND || option.type == APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND_GROUP) {
                    args.push(option.name);
                }
                else {
                    if (option.value) { args.push(option.value.toString()); }
                }
            });
            options = options[0]?.options;
        }
    }
    else if (interaction.type === INTERACTION_TYPE.MESSAGE_COMPONENT ||
        interaction.type === INTERACTION_TYPE.APPLICATION_COMMAND_AUTOCOMPLETE ||
        interaction.type === INTERACTION_TYPE.MODAL_SUBMIT)
    {
        const commandName = interaction.message?.interaction_metadata?.name?.toLowerCase();
        if (!commandName) { throw new Error(`Empty command prompt from interaction.type: ${interaction.type}`); }
        args = commandName.split(' ');
    }
    return args;
}
