import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE, BUTTON_STYLE, INTERACTION_RESPONSE_FLAGS, INTERACTION_RESPONSE_TYPE, INTERACTION_TYPE, TEXT_INPUT_STYLE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse, MessageData, ModalData } from '../templates/discord/InteractionResponse.js'
import { ActionRow, ButtonNonLink, StringSelect, StringSelectOption, TextInput } from '../templates/discord/MessageComponents.js';
import { isOriginalUserInvoked } from '../handlers/InteractionHandler.js';

const applicationCommand = new ApplicationCommand(
    'reminder',
    'Add/remove/manage reminders.',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const execute = async function(interaction: any, env: any, args: string[]) {
    const interactionResponse = new InteractionResponse(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE, new MessageData());

    const embed = new Embed();
    embed.setTitle('Reminder');
    // TODO: get existing reminders and put it on embed
    
    if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
        if (!isOriginalUserInvoked(interaction)) {
            interactionResponse.data?.setContent('\`Error: You are not the original user who triggered the interaction. Please invoke a new slash command.\`');
            interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
            return interactionResponse;
        }
        interactionResponse.setType(INTERACTION_RESPONSE_TYPE.UPDATE_MESSAGE);

        const componentTriggered = interaction.data.custom_id;
        if (componentTriggered == COMPONENT.ADD_BUTTON) {
            // Add reminder button was pressed
            interactionResponse.setType(INTERACTION_RESPONSE_TYPE.MODAL);
            interactionResponse.setData(new ModalData('modal', 'Add Reminder'));
            const reminderRow = new ActionRow();
            const dateRow = new ActionRow();
            const timeRow = new ActionRow();
            const reminderInput = new TextInput('reminder', TEXT_INPUT_STYLE.PARAGRAPH, 'What is the reminder for?');
            const dateInput = new TextInput('date', TEXT_INPUT_STYLE.SHORT, 'Date YYYY/MM/DD');
            const timeInput = new TextInput('time', TEXT_INPUT_STYLE.SHORT, 'Time HH:MM');
            reminderInput.setPlaceholder('Input reminder here');
            dateInput.setPlaceholder('YYYY/MM/DD');
            timeInput.setPlaceholder('HH:MM');
            reminderRow.addComponent(reminderInput);
            dateRow.addComponent(dateInput);
            timeRow.addComponent(timeInput);
            interactionResponse.data.addComponent(reminderRow);
            interactionResponse.data.addComponent(dateRow);
            interactionResponse.data.addComponent(timeRow);
            return interactionResponse;
        }
        else if (componentTriggered == COMPONENT.REMOVE_BUTTON) {
            // Remove reminder button was pressed
            // TODO: put reminders to delete as buttons
        }
        else if (componentTriggered == COMPONENT.TIMEZONE_BUTTON) {
            // Timezone button was pressed
            const actionRow = new ActionRow();
            const timezoneSelect = new StringSelect(COMPONENT.TIMEZONE_SELECT);
            timezoneSelect.setPlaceholder('Select your timezone');
            for (let i = -11; i < 13; i++) {
                const offsetString = i > 0 ? `+${i}` : i.toString();
                const time = new Date();
                time.setHours(time.getHours() + i);
                const timezoneOption = new StringSelectOption(time.toUTCString(), offsetString);
                timezoneOption.setDescription(offsetString);
                timezoneSelect.addOption(timezoneOption);
            }
            actionRow.addComponent(timezoneSelect);
            interactionResponse.data?.addEmbed(embed);
            interactionResponse.data?.addComponent(actionRow);
            return interactionResponse;
        }
        else if (componentTriggered == COMPONENT.TIMEZONE_SELECT) {
            // Timezone was selected
            const offsetString = interaction.data.values[0];
            // push timezone offset to db
        }
    }
    else if (interaction.type == INTERACTION_TYPE.MODAL_SUBMIT) {
        // Modal containing the added reminder data was submitted
        interactionResponse.setType(INTERACTION_RESPONSE_TYPE.UPDATE_MESSAGE);
        const reminder = interaction.data.components[0].components[0].value;
        const dateString = interaction.data.components[1].components[0].value;
        const timeString = interaction.data.components[2].components[0].value;
        const date = parseDate(dateString);
        if (!date) {
            interactionResponse.setType(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
            interactionResponse.data?.setContent('\`Error: The date must be in YYYY/MM/DD format.\`');
            interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
            return interactionResponse;
        }
        const time = parseTime(timeString);
        if (!time) {
            interactionResponse.setType(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
            interactionResponse.data?.setContent('\`Error: The time must be in HH:MM format.\`');
            interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
            return interactionResponse;
        }
        const dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());
        // TODO: upload new reminder to database
        // TODO: update embed desc
    }

    interactionResponse.data?.addEmbed(embed);
    
    const buttonAdd = new ButtonNonLink(COMPONENT.ADD_BUTTON);
    const buttonRemove = new ButtonNonLink(COMPONENT.REMOVE_BUTTON);
    const buttonTimezone = new ButtonNonLink(COMPONENT.TIMEZONE_BUTTON);
    buttonAdd.setStyle(BUTTON_STYLE.SUCCESS);
    buttonRemove.setStyle(BUTTON_STYLE.DANGER);
    buttonTimezone.setStyle(BUTTON_STYLE.PRIMARY);
    buttonAdd.setLabel('Add reminder');
    buttonRemove.setLabel('Remove reminder');
    buttonTimezone.setLabel('Set timezone');
    const actionRow = new ActionRow();
    actionRow.addComponent(buttonAdd);
    actionRow.addComponent(buttonRemove);
    actionRow.addComponent(buttonTimezone);
    interactionResponse.data?.addComponent(actionRow);

    return interactionResponse;
}

enum COMPONENT {
    ADD_BUTTON = 'add',
    REMOVE_BUTTON = 'remove',
    TIMEZONE_BUTTON = 'timezone',
    TIMEZONE_SELECT = 'timezone_select'
}

/**
 * Parse date in YYYY/MM/DD format
 */
function parseDate(dateString: string) {
    const year = dateString.match(/^\d{4}(?=\/)/u);
    const month = dateString.match(/(?<=\/)\d{1,2}(?=\/)/u);
    const day = dateString.match(/(?<=\/)\d{1,2}$/u);
    if (year == null || month == null || day == null) {
        return;
    }
    return new Date(Number(year), Number(month)-1, Number(day)); // Month value starts from 0 for whatever reason
}

/**
 * Parse time in HH:MM format
 */
function parseTime(timeString: string) {
    const hour = timeString.match(/^\d{1,2}(?=:)/u);
    const minute = timeString.match(/(?<=:)\d{1,2}$/u);
    if (hour == null || minute == null) {
        return;
    }
    return new Date(0, 0, 0, Number(hour), Number(minute));
}

/**
 * Reminder Command
 */
export const Reminder = new Command(applicationCommand, execute);
