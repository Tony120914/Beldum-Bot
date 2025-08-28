import { ApplicationCommand, ApplicationCommandOption } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_OPTION_TYPE, APPLICATION_COMMAND_TYPE, APPLICATION_INTEGRATION_TYPE, IMAGE_FORMAT, IMAGE_SIZE, INTERACTION_CALLBACK_TYPE, INTERACTION_TYPE, USER_PREMIUM_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { buildDiscordAPIUrl, buildDiscordImageUrl, buildEmoji, buildRole, buildUser, parseEmoji } from '../handlers/MessageHandler.js';
import { ephemeralError, getFetchErrorText } from '../handlers/ErrorHandler.js';
import type { Role } from '../templates/discord/resources/PermissionsResources.js';
import type { Guild, GuildMember } from '../templates/discord/resources/GuildResources.js';
import { SnowflakeParser } from '../templates/discord/Snowflake.js';
import type { Channel } from '../templates/discord/resources/ChannelResources.js';
import type { User } from '../templates/discord/resources/UserResources.js';
import type { Application } from '../templates/discord/resources/ApplicationResources.js';
import { ActionRow, ButtonLink, ChannelSelect, RoleSelect, UserSelect } from '../templates/discord/MessageComponents.js';
import { isOriginalUserInvoked } from '../handlers/InteractionHandler.js';
import { Commands } from '../commands.js';
import { formatTypeToString } from '../handlers/Utils.js';
import type { Interaction } from '../templates/discord/InteractionReceive.js';

const applicationCommand = new ApplicationCommand(
    'info',
    'Get information and downloadable images from a selection of Discord related features.',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);
applicationCommand.removeIntegrationType(APPLICATION_INTEGRATION_TYPE.USER_INSTALL);

/**
 * Bot option
 */
const botOption = new ApplicationCommandOption(
    'bot',
    'Get Beldum Bot\'s information and resources on how to use the bot.',
    APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND
);
applicationCommand.addOptions(botOption);

/**
 * Channel option
 */
const channelOption = new ApplicationCommandOption(
    'channel',
    'Get the selected channel\'s information',
    APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND
);
applicationCommand.addOptions(channelOption);

/**
 * Custom Emoji options
 */
const customEmojiOption = new ApplicationCommandOption(
    'emoji',
    'Get a custom emoji\'s information and downloadable image with the highest possible size.',
    APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND
);
const customEmojiInputOption = new ApplicationCommandOption(
    'emoji',
    'The desired custom emoji',
    APPLICATION_COMMAND_OPTION_TYPE.STRING
);
customEmojiInputOption.setRequired(true);
customEmojiOption.addOption(customEmojiInputOption);
applicationCommand.addOptions(customEmojiOption);

/**
 * Role options
 */
const roleOption = new ApplicationCommandOption(
    'role',
    'Get the selected role\'s information and downloadable icon with the highest possible size.',
    APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND
);
applicationCommand.addOptions(roleOption);

/**
 * Guild options
 */
const guildOption = new ApplicationCommandOption(
    'server',
    'Get the server\'s information and downloadable icon/splash/banner with the highest possible size.',
    APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND
);
applicationCommand.addOptions(guildOption);

/**
 * User options
 */
const userOption = new ApplicationCommandOption(
    'user',
    'Get the selected user\'s information and avatar/decoration/banner with the highest possible size.',
    APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND
);
applicationCommand.addOptions(userOption);

const execute = async function(interaction: Interaction, env: Env, args: string[]) {
    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': env.USER_AGENT,
        'Authorization': `Bot ${env.DISCORD_TOKEN}`,
    }
    const interactionResponse = new InteractionResponse(INTERACTION_CALLBACK_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    const data = interactionResponse.initMessageData();
    const subcommand = args[1];
    switch (subcommand) {
        case 'bot': {
            const url = buildDiscordAPIUrl(['applications', '@me'], []);
            const response = await fetch(url, {
                headers: headers
            });
            if (!response.ok) {
                const error = await getFetchErrorText(response);
                return ephemeralError(interactionResponse, 'Error: Something went wrong. Please try again later.', error);
            }
            const application: Application = await response.json();
            const embed = new Embed();
            embed.setTitle(application.name);
            embed.setDescription(application.description);
            embed.addField('Prefix (slash commands)', '`/`', true);
            embed.addField('Creator', buildUser(application.owner?.id), true);
            embed.addBlankField();
            embed.addField('Chat commands', getChatInputCommands().join(' '), true);
            embed.addField('Message commands', getMessageCommands().join(' '), true);
            embed.initFooter('https://raw.githubusercontent.com/Tony120914/Beldum-Bot/master/assets/info-ultra-ball.png');
            const joinedDiscord = new Date(SnowflakeParser.getTimestamp(application.id));
            embed.addField('Created', joinedDiscord.toString());
            if (application.icon) {
                const url = buildDiscordImageUrl(['app-icons', application.id, application.icon], IMAGE_FORMAT.PNG, IMAGE_SIZE.XXX_LARGE);
                embed.initThumbnail(url);
            }
            if (application.approximate_guild_count) {
                embed.initFooter(`Approximately in ${application.approximate_guild_count} servers.`);
                embed.setTimestampOn();
            }
            data.addEmbed(embed);

            const actionRow1 = new ActionRow();
            const actionRow2 = new ActionRow();
            const buttonInvite = new ButtonLink('https://discord.com/oauth2/authorize?client_id=454764425090433034');
            const buttonDocs = new ButtonLink('https://tony120914.github.io/beldum-bot-site/#/docs');
            const buttonDonate = new ButtonLink('https://tony120914.github.io/beldum-bot-site/#/donate');
            const buttonVote = new ButtonLink('https://tony120914.github.io/beldum-bot-site/#/vote');
            const buttonSourceCode = new ButtonLink('https://github.com/Tony120914/Beldum-Bot');
            buttonInvite.setLabel('New invite');
            buttonDocs.setLabel('Docs');
            buttonDonate.setLabel('Donate');
            buttonVote.setLabel('Vote');
            buttonSourceCode.setLabel('Source Code');
            buttonInvite.setEmoji(undefined, '➕');
            buttonDocs.setEmoji(undefined, '📄');
            buttonDonate.setEmoji(undefined, '💝');
            buttonVote.setEmoji(undefined, '🗳️');
            buttonSourceCode.setEmoji(undefined, '💻');
            actionRow1.addComponent(buttonInvite);
            actionRow1.addComponent(buttonDocs);
            actionRow1.addComponent(buttonDonate);
            actionRow1.addComponent(buttonVote);
            actionRow2.addComponent(buttonSourceCode);
            data.addComponent(actionRow1);
            data.addComponent(actionRow2);
            break;
        }
        case 'channel': {
            if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
                if (!isOriginalUserInvoked(interaction)) {
                    return ephemeralError(interactionResponse, 'Error: You are not the original user who triggered the interaction. Please invoke a new slash command.');
                }
                interactionResponse.setType(INTERACTION_CALLBACK_TYPE.UPDATE_MESSAGE);
                const guildId = interaction.guild_id;
                const channelId = interaction.data?.values![0];
                if (!channelId) { return ephemeralError(interactionResponse, 'Error: channel id not found.'); }
                const channel = interaction.data?.resolved?.channels![channelId];
                if (!channel) { return ephemeralError(interactionResponse, 'Error: channel not found.'); }
                const embed = new Embed();
                embed.setTitle('Channel Info');
                const url = `https://discord.com/channels/${guildId}/${channelId}`;
                embed.setUrl(url);
                if (channel.nsfw) { embed.setDescription('NSFW :face_with_peeking_eye:'); }
                embed.addField('Name', channel.name, true);
                embed.addField('Topic', channel.topic, true);
                embed.addField('Creator', buildUser(channel.owner_id), true);
                embed.addField('Bitrate', channel.bitrate?.toString(), true);
                if (channel.message_count && channel.total_message_sent) {
                    const deletedMessagesCount = Math.abs(channel.total_message_sent - channel.message_count);
                    embed.addField('Deleted / total messages', `${deletedMessagesCount} / ${channel.total_message_sent}`, true);
                }
                const created = new Date(SnowflakeParser.getTimestamp(channel.id));
                embed.addField('Created', created.toString());
                data.addEmbed(embed);
            }
            const channelSelect = new ChannelSelect('channel_select');
            channelSelect.setPlaceholder('Select a channel');
            const actionRow = new ActionRow();
            actionRow.addComponent(channelSelect);
            data.addComponent(actionRow);
            break;
        }
        case 'emoji': {
            const emojiString = args[2];
            const emoji = parseEmoji(emojiString);
            if (!emoji || !emoji.id) {
                return ephemeralError(interactionResponse, 'Error: Custom emojis only.');
            }
            const embed = new Embed();
            embed.setTitle('Emoji Info');
            const format = emoji.animated ? IMAGE_FORMAT.GIF : IMAGE_FORMAT.PNG
            const url = buildDiscordImageUrl(['emojis', emoji.id], format, IMAGE_SIZE.XXX_LARGE);
            embed.setUrl(url);
            embed.setDescription(emojiString);
            embed.addField('Name', emoji.name, true);
            const created = new Date(SnowflakeParser.getTimestamp(emoji.id));
            embed.addField('Created', created.toString(), true);
            embed.initImage(url);
            data.addEmbed(embed);
            break;
        }
        case 'role': {
            if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
                if (!isOriginalUserInvoked(interaction)) {
                    return ephemeralError(interactionResponse, 'Error: You are not the original user who triggered the interaction. Please invoke a new slash command.');
                }
                interactionResponse.setType(INTERACTION_CALLBACK_TYPE.UPDATE_MESSAGE);
                if (!interaction.data?.values || !interaction.data.resolved?.roles || !interaction.data.values[0]) { return ephemeralError(interactionResponse, 'Error: 🐛'); }
                const roleId = interaction.data.values[0];
                const role = interaction.data.resolved?.roles[roleId];
                if (!role) { return ephemeralError(interactionResponse, 'Error: role does not exist.'); }
                const embed = new Embed();
                embed.setTitle('Role Info');
                embed.setDescription(`${role.unicode_emoji || ''} ${buildRole(roleId)}`);
                embed.addField('Name', role.name, true);
                const created = new Date(SnowflakeParser.getTimestamp(role.id));
                embed.addField('Created', created.toString(), true);
                if (role.icon) {
                    const url = buildDiscordImageUrl(['role-icons', role.id, role.icon], IMAGE_FORMAT.PNG, IMAGE_SIZE.XXX_LARGE);
                    embed.setUrl(url);
                    embed.initImage(url);
                }
                data.addEmbed(embed);
            }
            const roleSelect = new RoleSelect('role_select');
            roleSelect.setPlaceholder('Select a role');
            const actionRow = new ActionRow();
            actionRow.addComponent(roleSelect);
            data.addComponent(actionRow);
            break;
        }
        case 'server': {
            const guildId = interaction.guild_id;
            const channelId = interaction.channel_id;
            if (!guildId) {
                return ephemeralError(interactionResponse, 'Error: Must be used in servers.');
            }
            const url = buildDiscordAPIUrl(['guilds', guildId], ['with_counts=true']);
            const response = await fetch(url, {
                headers: headers
            });
            if (!response.ok) {
                const error = await getFetchErrorText(response);
                return ephemeralError(interactionResponse, 'Error: Something went wrong. Please try again later.', error);
            }
            const guild: Guild = await response.json();
            const embed = new Embed();
            embed.setTitle('Server Info');
            const sameUrl = `https://discord.com/channels/${guildId}/${channelId}`; // Embeds having the same URL allows an embed to have multiple images for whatever reason...
            embed.setUrl(sameUrl);
            embed.addField('Name', guild.name, true);
            embed.addField('Owner', buildUser(guild.owner_id), true);
            embed.addField('Online / total users (approx)', `${guild.approximate_presence_count} / ${guild.approximate_member_count}`, true);
            embed.addBlankField();
            embed.addField('Description', guild.description, true);
            embed.addBlankField();
            embed.addField('Server boost level', guild.premium_tier.toString(), true);
            embed.addField('Number of boosts', guild.premium_subscription_count?.toString(), true);
            let roles = '';
            guild.roles.forEach(role => {
                roles += `${buildRole(role.id)} `;
            });
            embed.addField('Roles', roles);
            let emojis = '';
            guild.emojis.forEach(emoji => {
                emojis += `${buildEmoji(emoji.name, emoji.id, emoji.animated)} `;
            });
            embed.addField('Emojis', emojis, true);
            let stickers = '';
            guild.stickers?.forEach(sticker => {
                stickers += `[${sticker.name}](${buildDiscordImageUrl(['stickers', sticker.id], formatTypeToString(sticker.format_type), IMAGE_SIZE.XXX_LARGE)}), `;
            });
            embed.addField('Stickers', stickers, true);
            const created = new Date(SnowflakeParser.getTimestamp(guild.id));
            embed.addField('Created', created.toString());
            data.addEmbed(embed);
            if (guild.icon) {
                const format = guild.icon.startsWith('a_') ? IMAGE_FORMAT.GIF : IMAGE_FORMAT.PNG;
                const url = buildDiscordImageUrl(['icons', guild.id, guild.icon], format, IMAGE_SIZE.XXX_LARGE);
                const embed = new Embed();
                embed.initImage(url);
                embed.setUrl(sameUrl);
                data.addEmbed(embed);
            }
            if (guild.splash) {
                const url = buildDiscordImageUrl(['splashes', guild.id, guild.splash], IMAGE_FORMAT.PNG, IMAGE_SIZE.XXX_LARGE);
                const embed = new Embed();
                embed.initImage(url);
                embed.setUrl(sameUrl);
                data.addEmbed(embed);
            }
            if (guild.discovery_splash) {
                const url = buildDiscordImageUrl(['discovery-splashes', guild.id, guild.discovery_splash], IMAGE_FORMAT.PNG, IMAGE_SIZE.XXX_LARGE);
                const embed = new Embed();
                embed.initImage(url);
                embed.setUrl(sameUrl);
                data.addEmbed(embed);
            }
            if (guild.banner) {
                const format = guild.banner.startsWith('a_') ? IMAGE_FORMAT.GIF : IMAGE_FORMAT.PNG;
                const url = buildDiscordImageUrl(['banners', guild.id, guild.banner], format, IMAGE_SIZE.XXX_LARGE);
                const embed = new Embed();
                embed.initImage(url);
                embed.setUrl(sameUrl);
                data.addEmbed(embed);
            }
            break;
        }
        case 'user': {
            if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
                if (!isOriginalUserInvoked(interaction)) {
                    return ephemeralError(interactionResponse, 'Error: You are not the original user who triggered the interaction. Please invoke a new slash command.');
                }
                if (!interaction.data?.values || !interaction.data.resolved?.members) { return ephemeralError(interactionResponse, 'Error: 🐛'); }
                // Get GuildMember object
                interactionResponse.setType(INTERACTION_CALLBACK_TYPE.UPDATE_MESSAGE);
                const guildId = interaction.guild_id;
                const channelId = interaction.channel_id;
                const userId = interaction.data.values[0];
                if (!userId) { return ephemeralError(interactionResponse, 'Error: user does not exist.'); }
                const guildMember = guildId ? interaction.data.resolved.members[userId] : null;
                if (!guildMember) { return ephemeralError(interactionResponse, 'Error: user does not exist in this server.'); }

                // Get User Object
                const url = buildDiscordAPIUrl(['users', userId], []);
                const response = await fetch(url, {
                    headers: headers
                });
                if (!response.ok) {
                    const error = await getFetchErrorText(response);
                    return ephemeralError(interactionResponse, 'Error: Something went wrong. Please try again later.', error);
                }
                const user: User = await response.json();

                const embed = new Embed();
                embed.setTitle('User Info');
                const sameUrl = `https://discord.com/channels/${guildId}/${channelId}`; // Embeds having the same URL allows an embed to have multiple images for whatever reason...
                embed.setUrl(sameUrl);
                embed.setDescription(`${buildUser(user.id)}${user.premium_type == USER_PREMIUM_TYPE.NONE || !user.premium_type ? '' : ' :whale:'}`);
                embed.addField('Server name', guildMember.nick, true);
                embed.addField('Display name', user.global_name, true);
                embed.addField('Username', user.username, true);
                if (user.discriminator != '0') {
                    embed.addField('#', user.discriminator, true);
                }
                let roles = '';
                guildMember.roles.forEach(roleId => {
                    roles += `${buildRole(roleId)} `;
                });
                embed.addField('Roles', roles);
                if (guildMember.joined_at) {
                    const joinedServer = new Date(guildMember.joined_at);
                    embed.addField('Joined server', joinedServer.toString(), true);
                }
                if (guildMember.premium_since) {
                    const boosterSince = new Date(guildMember.premium_since);
                    embed.addField('Booster since', boosterSince.toString(), true);
                }
                embed.addBlankField()
                const joinedDiscord = new Date(SnowflakeParser.getTimestamp(user.id));
                embed.addField('Joined Discord', joinedDiscord.toString(), true);
                if (guildMember.communication_disabled_until) {
                    const timeoutExpires = new Date(guildMember.communication_disabled_until);
                    embed.addField('Timeout expires', timeoutExpires.toString(), true);
                }
                data.addEmbed(embed);
                if (guildMember.avatar && guildId) {
                    const format = guildMember.avatar.startsWith('a_') ? IMAGE_FORMAT.GIF : IMAGE_FORMAT.PNG;
                    const url = buildDiscordImageUrl(['guilds', guildId, 'users', userId, 'avatars', guildMember.avatar], format, IMAGE_SIZE.XXX_LARGE);
                    const embed = new Embed();
                    embed.initImage(url);
                    embed.setUrl(sameUrl);
                    data.addEmbed(embed);
                }
                if (user.avatar) {
                    const format = user.avatar.startsWith('a_') ? IMAGE_FORMAT.GIF : IMAGE_FORMAT.PNG;
                    const url = buildDiscordImageUrl(['avatars', userId, user.avatar], format, IMAGE_SIZE.XXX_LARGE);
                    const embed = new Embed();
                    embed.initImage(url);
                    embed.setUrl(sameUrl);
                    data.addEmbed(embed);
                }
                if (user.avatar_decoration) {
                    const url = buildDiscordImageUrl(['avatar-decorations', userId, user.avatar_decoration], IMAGE_FORMAT.PNG, IMAGE_SIZE.XXX_LARGE);
                    const embed = new Embed();
                    embed.initImage(url);
                    embed.setUrl(sameUrl);
                    data.addEmbed(embed);
                }
                if (user.banner) {
                    const format = user.banner.startsWith('a_') ? IMAGE_FORMAT.GIF : IMAGE_FORMAT.PNG;
                    const url = buildDiscordImageUrl(['banners', userId, user.banner], format, IMAGE_SIZE.XXX_LARGE);
                    const embed = new Embed();
                    embed.initImage(url);
                    embed.setUrl(sameUrl);
                    data.addEmbed(embed);
                }
            }
            const actionRow = new ActionRow();
            const userSelect = new UserSelect('user_select');
            userSelect.setPlaceholder('Select a user');
            actionRow.addComponent(userSelect);
            data.addComponent(actionRow);
            break;
        }
        default: {
            return ephemeralError(interactionResponse, 'Error: Incorrect subcommand.');
        }
    }
    return interactionResponse;
}

/**
 * Returns a list of chat input commands where each command is in the form of:
 * `/command <subcommands>`
 */
function getChatInputCommands() {
    const chatInputCommands: string[] = [];
    const commands = Array.from(Commands.map.values());
    commands.forEach(command => {
        if (command.applicationCommand.type == APPLICATION_COMMAND_TYPE.CHAT_INPUT) {
            const commandName = command.applicationCommand.name;
            const commandOptions = command.applicationCommand.options?.filter(option => {
                return option.type == APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND ||
                    option.type == APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND_GROUP;
            });
            chatInputCommands.push(`\`/${commandName}${commandOptions?.length != 0 ? ' <subcommands>' : ''}\``);
        }        
    });
    return chatInputCommands;
}

/**
 * Returns a list of message commands where each command is in the form of:
 * `/command`
 */
function getMessageCommands() {
    const messageCommands: string[] = [];
    const commands = Array.from(Commands.map.values());
    commands.forEach(command => {
        if (command.applicationCommand.type == APPLICATION_COMMAND_TYPE.MESSAGE) {
            const commandName = command.applicationCommand.name;
            messageCommands.push(`\`${commandName}\``);
        }        
    });
    return messageCommands;
}

/**
 * Info Command
 */
export const Info = new Command(applicationCommand, execute);
