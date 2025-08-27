import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE, APPLICATION_INTEGRATION_TYPE, BUTTON_STYLE, INTERACTION_CALLBACK_TYPE, INTERACTION_TYPE, TEXT_INPUT_STYLE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse, ModalData } from '../templates/discord/InteractionResponse.js'
import { ActionRow, ButtonNonLink, StringSelect, StringSelectOption, TextInput } from '../templates/discord/MessageComponents.js';
import { isOriginalUserInvoked } from '../handlers/InteractionHandler.js';
import { insertUserReminder, selectUserReminderAll, selectUserField, selectUserReminderCount, upsertUser, deleteUserReminder, selectUserReminderExpired, decrementUserReminderTTL } from '../handlers/DatabaseHandler.js';
import { UserReminder, User } from '../templates/db/Reminder.js';
import { ephemeralError, getFetchErrorText } from '../handlers/ErrorHandler.js';
import { buildDiscordAPIUrl, buildUser } from '../handlers/MessageHandler.js';
import type { Interaction } from '../templates/discord/InteractionReceive.js';

const applicationCommand = new ApplicationCommand(
    'reminder',
    'Add/remove/manage reminders.',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);
applicationCommand.removeIntegrationType(APPLICATION_INTEGRATION_TYPE.USER_INSTALL);

const REMINDER_LIMIT = 10;
const execute = async function(interaction: Interaction, env: Env, args: string[]) {
    const interactionResponse = new InteractionResponse(INTERACTION_CALLBACK_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    const data = interactionResponse.initMessageData();
    const channelId = interaction.channel_id;
    let userId = interaction.member?.user?.id ? interaction.member.user.id : interaction.user?.id;
    
    if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
        if (!isOriginalUserInvoked(interaction)) {
            return ephemeralError(interactionResponse, 'Error: You are not the original user who triggered the interaction. Please invoke a new slash command.');
        }
        interactionResponse.setType(INTERACTION_CALLBACK_TYPE.UPDATE_MESSAGE);

        userId = interaction.message?.interaction_metadata?.user.id;
        if (!userId) { return ephemeralError(interactionResponse, 'Error: user id not found.'); }
        const componentTriggered = interaction.data?.custom_id;
        if (componentTriggered == COMPONENT.ADD_BUTTON) {
            // Add reminder button was pressed
            let reminderCount: number;
            try {
                reminderCount = await selectUserReminderCount(env, userId) as number;
            } catch(error) {
                return ephemeralError(interactionResponse, 'Error: Something went wrong. Please try again later.', error);
            }
            if (reminderCount >= REMINDER_LIMIT) {
                return ephemeralError(interactionResponse, `Error: You can only have up to ${reminderCount} reminders.`);
            }
            interactionResponse.setType(INTERACTION_CALLBACK_TYPE.MODAL);
            const data = interactionResponse.initModalData('modal', 'Add Reminder')
            const reminderRow = new ActionRow();
            const dateRow = new ActionRow();
            const timeRow = new ActionRow();
            const reminderInput = new TextInput('reminder', TEXT_INPUT_STYLE.PARAGRAPH, 'What is the reminder for?');
            const dateInput = new TextInput('date', TEXT_INPUT_STYLE.SHORT, 'Date YYYY/MM/DD');
            const timeInput = new TextInput('time', TEXT_INPUT_STYLE.SHORT, 'Time HH:MM (Expect a few minutes of delay)');
            reminderInput.setPlaceholder('Input reminder here');
            dateInput.setPlaceholder('YYYY/MM/DD');
            timeInput.setPlaceholder('HH:MM (24 hour format)');
            reminderInput.setMaxLength(256);
            dateInput.setMaxLength('YYYY/MM/DD'.length);
            timeInput.setMaxLength('HH:MM'.length);
            reminderRow.addComponent(reminderInput);
            dateRow.addComponent(dateInput);
            timeRow.addComponent(timeInput);
            data.addComponent(reminderRow);
            data.addComponent(dateRow);
            data.addComponent(timeRow);
            return interactionResponse;
        }
        else if (componentTriggered == COMPONENT.REMOVE_BUTTON) {
            // Remove reminder button was pressed
            const actionRow = new ActionRow();
            const removeSelect = new StringSelect(COMPONENT.REMOVE_SELECT);
            removeSelect.setPlaceholder('Select the reminder to remove');
            let reminders;
            try {
                reminders = await selectUserReminderAll(env, userId);
                reminders = reminders.results as unknown as UserReminder[];
            } catch(error) {
                return ephemeralError(interactionResponse, 'Error: Something went wrong. Please try again later.', error);
            }
            if (reminders.length == 0) {
                return ephemeralError(interactionResponse, 'Error: You don\'t have any reminders to remove.');
            }
            let offset: number;
            try {
                offset = await selectUserField(env, userId, 'utcOffset') as number;
                offset = offset == null ? 0 : offset;
            } catch(error) {
                return ephemeralError(interactionResponse, 'Error: Something went wrong. Please try again later.', error);
            }
            for (const userReminder of reminders) {
                const datetime = new Date(userReminder.reminderDatetime);
                datetime.setUTCHours(datetime.getUTCHours() + offset);
                const removeOption = new StringSelectOption(datetime.toUTCString().replace('GMT', ''), userReminder.rowId.toString());
                removeOption.setDescription(userReminder.reminder.slice(0,100));
                removeSelect.addOption(removeOption);
            }
            actionRow.addComponent(removeSelect);
            data.addComponent(actionRow);
        }
        else if (componentTriggered == COMPONENT.TIMEZONE_BUTTON) {
            // Timezone button was pressed
            const actionRow = new ActionRow();
            const timezoneSelect = new StringSelect(COMPONENT.TIMEZONE_SELECT);
            timezoneSelect.setPlaceholder('Select your timezone');
            for (let i = -11; i < 13; i++) {
                const offsetString = prependPlus(i);
                const time = new Date();
                time.setUTCHours(time.getUTCHours() + i);
                const timezoneOption = new StringSelectOption(time.toUTCString().replace('GMT', ''), offsetString);
                timezoneOption.setDescription(offsetString);
                timezoneSelect.addOption(timezoneOption);
            }
            actionRow.addComponent(timezoneSelect);
            data.addComponent(actionRow);
        }
        else if (componentTriggered == COMPONENT.REMOVE_SELECT) {
            // Remove a certain reminder was selected
            if (!interaction.data?.values) { return ephemeralError(interactionResponse, 'Error: 🐛'); }
            const rowId = Number(interaction.data.values[0]);
            try {
                await deleteUserReminder(env, rowId);
            } catch(error) {
                return ephemeralError(interactionResponse, 'Error: Something went wrong. Please try again later.', error);
            }
        }
        else if (componentTriggered == COMPONENT.TIMEZONE_SELECT) {
            // Timezone was selected
            if (!interaction.data?.values) { return ephemeralError(interactionResponse, 'Error: 🐛'); }
            const offset = Number(interaction.data.values[0]);
            const userTimezone = new User(userId, offset);
            try {
                await upsertUser(env, userTimezone);
            } catch(error) {
                return ephemeralError(interactionResponse, 'Error: Something went wrong. Please try again later.', error);
            }
        }
    }
    else if (interaction.type == INTERACTION_TYPE.MODAL_SUBMIT) {
        // Modal containing the added reminder data was submitted
        interactionResponse.setType(INTERACTION_CALLBACK_TYPE.UPDATE_MESSAGE);
        const userId = interaction.message?.interaction_metadata?.user.id;
        if (!userId) { return ephemeralError(interactionResponse, 'Error: user id not found.'); }
        const modalData = interaction.data?.components;
        if (!modalData) { return ephemeralError(interactionResponse, 'Error: modal input error.'); }
        const reminder = (modalData[0]?.components[0] as TextInput).value;
        const dateString = (modalData[1]?.components[0] as TextInput).value;
        const timeString = (modalData[2]?.components[0] as TextInput).value;
        if (!reminder) { return ephemeralError(interactionResponse, 'Error: Invalid reminder text.'); }
        const date = parseDate(dateString);
        if (!date) { return ephemeralError(interactionResponse, 'Error: The date must be in YYYY/MM/DD format.'); }
        const time = parseTime(timeString);
        if (!time) { return ephemeralError(interactionResponse, 'Error: The time must be in HH:MM format.'); }
        let offset: number;
        try {
            offset = await selectUserField(env, userId, 'utcOffset') as number;
            offset = offset == null ? 0 : offset;
        } catch(error) {
            return ephemeralError(interactionResponse, 'Error: Something went wrong. Please try again later.', error);
        }
        const dateTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), time.getUTCHours() - offset, time.getUTCMinutes()));
        const now = new Date();
        if (dateTime <= now) {
            return ephemeralError(interactionResponse, 'Error: I wish I could set a reminder in the past too but... it was the choice of Stein;Gate.');
        }
        if (!channelId) { return ephemeralError(interactionResponse, 'Error: channel id not found. '); }
        const userReminder = new UserReminder(userId, channelId, reminder, dateTime.toISOString());
        try {
            await insertUserReminder(env, userReminder);
        } catch(error) {
            return ephemeralError(interactionResponse, 'Error: Something went wrong. Please try again later.', error);
        }
    }

    // Fetch data from DB to show for embed
    let offset: number;
    let reminders;
    try {
        if (!userId) { return ephemeralError(interactionResponse, 'Error: user id not found'); }
        offset = await selectUserField(env, userId, 'utcOffset') as number;
        offset = offset == null ? 0 : offset;
        reminders = await selectUserReminderAll(env, userId);
        reminders = reminders.results as unknown as UserReminder[];
    } catch(error) {
        return ephemeralError(interactionResponse, 'Error: Something went wrong. Please try again later.', error);
    }

    const embed = new Embed();
    embed.setTitle('Reminder');
    embed.setDescription('Make sure I have `Send Messages` and `Embed Links` permissions for reminders to work.');
    const datetime = new Date();
    datetime.setUTCHours(datetime.getUTCHours() + offset);
    embed.addField('Your current time', `${datetime.toUTCString().replace('GMT', '')}\n(If the time is wrong, change your timezone.)`, true);
    embed.addField('UTC Offset', prependPlus(offset), true);
    embed.addBlankField();
    for (const userReminder of reminders) {
        const datetime = new Date(userReminder.reminderDatetime);
        datetime.setUTCHours(datetime.getUTCHours() + offset);
        embed.addField(datetime.toUTCString().replace('GMT', ''), userReminder.reminder, true);
    }
    data.addEmbed(embed);
    
    const buttonAdd = new ButtonNonLink(COMPONENT.ADD_BUTTON, BUTTON_STYLE.SUCCESS);
    const buttonRemove = new ButtonNonLink(COMPONENT.REMOVE_BUTTON, BUTTON_STYLE.DANGER);
    const buttonTimezone = new ButtonNonLink(COMPONENT.TIMEZONE_BUTTON, BUTTON_STYLE.PRIMARY);
    buttonAdd.setLabel('Add reminder');
    buttonRemove.setLabel('Remove reminder');
    buttonTimezone.setLabel('Set timezone');
    buttonAdd.setEmoji(undefined, '➕');
    buttonRemove.setEmoji(undefined, '➖');
    buttonTimezone.setEmoji(undefined, '🕒');
    const actionRow = new ActionRow();
    actionRow.addComponent(buttonAdd);
    actionRow.addComponent(buttonRemove);
    actionRow.addComponent(buttonTimezone);
    data.addComponent(actionRow);

    return interactionResponse;
}

enum COMPONENT {
    ADD_BUTTON = 'add',
    REMOVE_BUTTON = 'remove',
    REMOVE_SELECT = 'remove_select',
    TIMEZONE_BUTTON = 'timezone',
    TIMEZONE_SELECT = 'timezone_select'
}

/**
 * Parse date in YYYY/MM/DD format
 */
function parseDate(dateString?: string | undefined) {
    if (!dateString) { return; }
    const year = dateString.match(/^\d{4}(?=\/)/u);
    const month = dateString.match(/(?<=\/)\d{1,2}(?=\/)/u);
    const day = dateString.match(/(?<=\/)\d{1,2}$/u);
    if (year == null || month == null || day == null) {
        return null;
    }
    const date = new Date();
    date.setUTCFullYear(Number(year));
    date.setUTCMonth(Number(month)-1); // Month value starts from 0 for whatever reason
    date.setUTCDate(Number(day));
    return date;
}

/**
 * Parse time in HH:MM format
 */
function parseTime(timeString?: string | undefined) {
    if (!timeString) { return; }
    const hour = timeString.match(/^\d{1,2}(?=:)/u);
    const minute = timeString.match(/(?<=:)\d{1,2}$/u);
    if (hour == null || minute == null) {
        return;
    }
    const time = new Date();
    time.setUTCHours(Number(hour));
    time.setUTCMinutes(Number(minute));
    return time;
}

/**
 * Prepend '+' sign in front of positive integers and return as a string
 */
function prependPlus(number: number) {
    return number > 0 ? `+${number}` : number.toString();
}

/**
 * Scheduled cron job will trigger this to trigger reminders
 */
export async function triggerReminder(env: Env) {
    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': env.USER_AGENT,
        'Authorization': `Bot ${env.DISCORD_TOKEN}`,
    }
    let expiredReminders;
    try {
        expiredReminders = await selectUserReminderExpired(env);
        expiredReminders = expiredReminders.results as unknown as UserReminder[];
    } catch(error) {
        console.error(`Reminder(s) failed to trigger due to failed fetch from DB.\n${error}`);
        return;
    }
    for (const userReminder of expiredReminders) {
        // Send out reminders
        const embed = new Embed();
        embed.setTitle('Reminder');
        embed.setDescription(`${buildUser(userReminder.userId)}\n${userReminder.reminder}`);
        const body = {
            content: buildUser(userReminder.userId),
            embeds: [embed]
        }
        const url = buildDiscordAPIUrl(['channels', userReminder.channelId, 'messages'], []);
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const error = await getFetchErrorText(response);
            console.error(`Reminder(s) failed to trigger upon sending the reminder.\n${error}`);
            await decrementUserReminderTTL(env, userReminder.rowId);
            if (userReminder.ttl <= 0) {
                await deleteUserReminder(env, userReminder.rowId);
            }
            return;
        }
        // Removed the reminder that was send out from the DB
        try {
            await deleteUserReminder(env, userReminder.rowId);
        } catch(error) {
            console.error(`Reminder(s) failed to delete after sending the reminder.\n${error}`);
            return;
        }
        // Rate limiting watch
        const rateLimitRemaining= Number(response.headers.get('x-ratelimit-remaining'));
        if (rateLimitRemaining <= 1) { break; } // Break 1 before 0 remaining just in case
    }
}

/**
 * Reminder Command
 */
export const Reminder = new Command(applicationCommand, execute);
