import { ApplicationCommand, ApplicationCommandOption } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_OPTION_TYPE, APPLICATION_COMMAND_TYPE, CHANNEL_TYPE, IMAGE_FORMAT, IMAGE_SIZE, INTERACTION_RESPONSE_FLAGS, INTERACTION_RESPONSE_TYPE, INTERACTION_TYPE, USER_PREMIUM_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { buildDiscordAPIUrl, buildDiscordImageUrl, buildEmoji, buildRole, buildUser, parseEmoji } from '../handlers/MessageHandler.js';
import { getFetchErrorText } from '../handlers/ErrorHandler.js';
import { Role } from '../templates/discord/PermissionsResources.js';
import { Guild, GuildMember } from '../templates/discord/GuildResources.js';
import { Snowflake } from '../templates/discord/Snowflake.js';
import { Channel } from '../templates/discord/ChannelResources.js';
import { User } from '../templates/discord/UserResources.js';
import { Application } from '../templates/discord/ApplicationResources.js';
import { Sticker } from '../templates/discord/StickerResources.js';
import { ActionRow, ButtonLink, ChannelSelect, RoleSelect } from '../templates/discord/MessageComponents.js';

const applicationCommand = new ApplicationCommand(
    'info',
    'Get information and images from a selection of Discord related features.',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

/**
 * Bot option
 */
const botOption = new ApplicationCommandOption(
    'bot',
    'Get Beldum Bot\'s information.',
    APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND
);
applicationCommand.addOptions(botOption);

/**
 * Channel option
 */
const channelOption = new ApplicationCommandOption(
    'channel',
    'Get the channel\'s information',
    APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND
);
applicationCommand.addOptions(channelOption);

/**
 * Custom Emoji options
 */
const customEmojiOption = new ApplicationCommandOption(
    'emoji',
    'Get a custom emoji\'s information and image.',
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
    'Get a role\'s information and image.',
    APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND
);
applicationCommand.addOptions(roleOption);

/**
 * Guild options
 */
const guildOption = new ApplicationCommandOption(
    'server',
    'Get the server\'s information and images.',
    APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND
);
applicationCommand.addOptions(guildOption);

/**
 * Channel Thread option
 */
const threadOption = new ApplicationCommandOption(
    'thread',
    'Get the thread\'s information',
    APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND
);
applicationCommand.addOptions(threadOption);

/**
 * User options
 */
const userOption = new ApplicationCommandOption(
    'user',
    'Get a user\'s information and images.',
    APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND
);
const userInputOption = new ApplicationCommandOption(
    'user',
    'The desired user',
    APPLICATION_COMMAND_OPTION_TYPE.USER
);
userInputOption.setRequired(true);
userOption.addOption(userInputOption);
applicationCommand.addOptions(userOption);

const execute = async function(interaction: any, env: any, args: string[]) {
    let headers = {
        'Content-Type': 'application/json',
        'User-Agent': env.USER_AGENT,
        'Authorization': `Bot ${env.DISCORD_TOKEN}`,
    }
    const interactionResponse = new InteractionResponse(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    const subcommand = args[1];
    switch (subcommand) {
        case 'bot': {
            const url = buildDiscordAPIUrl(['applications', '@me'], []);
            const response = await fetch(url, {
                headers: headers
            });
            if (!response.ok) {
                const error = await getFetchErrorText(response);
                console.error(error);
                interactionResponse.data?.setContent('Error: Something went wrong. Please try again later.');
                interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
                return interactionResponse;
            }
            const data = await response.json();
            const application = new Application(data.id, data.name);
            application.assignObject(data);
            const embed = new Embed();
            embed.setTitle(application.name);
            embed.setDescription(application.description);
            embed.addField('Prefix (slash commands)', '`/`', true);
            embed.addField('List of commands', '`/help`', true);
            embed.addField('Creator', buildUser(application.owner?.id), true);
            const snowflake = new Snowflake(application.id);
            const joinedDiscord = new Date(snowflake.timestamp);
            embed.addField('Created', joinedDiscord.toString());
            if (application.icon) {
                const url = buildDiscordImageUrl(['app-icons', application.id, application.icon], IMAGE_FORMAT.PNG, IMAGE_SIZE.XXX_LARGE);
                embed.thumbnail?.setUrl(url);
            }
            if (application.approximate_guild_count) {
                embed.footer?.setText(`Approximately in ${application.approximate_guild_count} servers.`);
                embed.setTimestampOn();
            }
            interactionResponse.data?.addEmbed(embed);

            const actionRow = new ActionRow();
            const buttonInvite = new ButtonLink('https://discord.com/api/oauth2/authorize?client_id=454764425090433034&permissions=19456&scope=bot%20applications.commands');
            const buttonDonate = new ButtonLink('https://ko-fi.com/toeknee');
            const buttonWebsite = new ButtonLink('https://tony120914.github.io/beldum-bot-site');
            const buttonSourceCode = new ButtonLink('https://github.com/Tony120914/Beldum-Bot');
            buttonInvite.setLabel('Invite');
            buttonDonate.setLabel('Donate');
            buttonWebsite.setLabel('Website');
            buttonSourceCode.setLabel('Source Code');
            actionRow.addComponent(buttonInvite);
            actionRow.addComponent(buttonDonate);
            actionRow.addComponent(buttonWebsite);
            actionRow.addComponent(buttonSourceCode);
            interactionResponse.data?.addComponent(actionRow);
            break;
        }
        case 'channel': {
            const channelSelect = new ChannelSelect('channel_select');
            channelSelect.setPlaceholder('Select a channel');
            const actionRow = new ActionRow();
            actionRow.addComponent(channelSelect);
            interactionResponse.data?.addComponent(actionRow);
            if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
                const guildId = interaction.guild_id;
                const channelId = interaction.data.values[0];
                const data = interaction.data.resolved.channels[channelId];
                const channelType = data.type;
                const channel = new Channel(channelId, channelType);
                channel.assignObject(data);
                const embed = new Embed();
                embed.setTitle('Channel Info');
                const url = `https://discord.com/channels/${guildId}/${channelId}`;
                embed.setUrl(url);
                embed.addField('Name', channel.name, true);
                embed.addField('Topic', channel.topic, true);
                const snowflake = new Snowflake(channel.id);
                const created = new Date(snowflake.timestamp);
                embed.addField('Created', created.toString());
                interactionResponse.data?.addEmbed(embed);
                interactionResponse.setType(INTERACTION_RESPONSE_TYPE.UPDATE_MESSAGE);
            }
            break;
        }
        case 'emoji': {
            const emojiString = interaction.data.options[0].options[0].value;
            const emoji = parseEmoji(emojiString);
            if (!emoji) {
                interactionResponse.data?.setContent('Error: Custom emojis only.');
                interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
                return interactionResponse;
            }
            const embed = new Embed();
            embed.setTitle('Emoji Info');
            const format = emoji.animated ? IMAGE_FORMAT.GIF : IMAGE_FORMAT.PNG
            const url = buildDiscordImageUrl(['emojis', emoji.id], format, IMAGE_SIZE.XXX_LARGE);
            embed.setUrl(url);
            embed.setDescription(emojiString);
            embed.addField('Name', emoji.name, true);
            const snowflake = new Snowflake(emoji.id);
            const created = new Date(snowflake.timestamp);
            embed.addField('Created', created.toString(), true);
            embed.image?.setUrl(url);
            interactionResponse.data?.addEmbed(embed);
            break;
        }
        case 'role': {
            const roleSelect = new RoleSelect('role_select');
            roleSelect.setPlaceholder('Select a role');
            const actionRow = new ActionRow();
            actionRow.addComponent(roleSelect);
            interactionResponse.data?.addComponent(actionRow);
            if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
                const roleId = interaction.data.values[0];
                const data = interaction.data.resolved.roles[roleId];
                const roleName = data.name;
                const role = new Role(roleId, roleName);
                role.assignObject(data);
                const embed = new Embed();
                embed.setTitle('Role Info');
                embed.setDescription(`${role.unicode_emoji || ''} ${buildRole(roleId)}`);
                embed.addField('Name', role.name, true);
                const snowflake = new Snowflake(role.id);
                const created = new Date(snowflake.timestamp);
                embed.addField('Created', created.toString(), true);
                if (role.icon) {
                    const url = buildDiscordImageUrl(['role-icons', role.id, role.icon], IMAGE_FORMAT.PNG, IMAGE_SIZE.XXX_LARGE);
                    embed.setUrl(url);
                    embed.image?.setUrl(url);
                }
                interactionResponse.data?.addEmbed(embed);
                interactionResponse.setType(INTERACTION_RESPONSE_TYPE.UPDATE_MESSAGE);
            }
            break;
        }
        case 'server': {
            const guildId = interaction.guild_id;
            const channelId = interaction.channel_id;
            if (!guildId) {
                interactionResponse.data?.setContent('Error: Must be used in servers.');
                interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
                return interactionResponse;
            }
            const url = buildDiscordAPIUrl(['guilds', guildId], ['with_counts=true']);
            const response = await fetch(url, {
                headers: headers
            });
            if (!response.ok) {
                const error = await getFetchErrorText(response);
                console.error(error);
                interactionResponse.data?.setContent('Error: Something went wrong. Please try again later.');
                interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
                return interactionResponse;
            }
            const data = await response.json();
            const guild = new Guild(data.id, data.name);
            guild.assignObject(data);
            const embed = new Embed();
            embed.setTitle('Server Info');
            const sameUrl = `https://discord.com/channels/${guildId}/${channelId}`; // Embeds having the same URL allows an embed to have multiple images for whatever reason...
            embed.setUrl(sameUrl);
            embed.addField('Name', guild.name, true);
            embed.addField('Owner', buildUser(guild.owner_id), true);
            embed.addField('Users online / users total (approx)', `${guild.approximate_presence_count} / ${guild.approximate_member_count}`, true);
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
                stickers += `[${sticker.name}](${buildDiscordImageUrl(['stickers', sticker.id], Sticker.formatTypeToString(sticker.format_type), IMAGE_SIZE.XXX_LARGE)}), `;
            });
            embed.addField('Stickers', stickers, true);
            const snowflake = new Snowflake(guild.id);
            const created = new Date(snowflake.timestamp);
            embed.addField('Created', created.toString());
            interactionResponse.data?.addEmbed(embed);
            if (guild.icon) {
                const format = guild.icon.startsWith('a_') ? IMAGE_FORMAT.GIF : IMAGE_FORMAT.PNG;
                const url = buildDiscordImageUrl(['icons', guild.id, guild.icon], format, IMAGE_SIZE.XXX_LARGE);
                const embed = new Embed();
                embed.image?.setUrl(url);
                embed.setUrl(sameUrl);
                interactionResponse.data?.addEmbed(embed);
            }
            if (guild.splash) {
                const url = buildDiscordImageUrl(['splashes', guild.id, guild.splash], IMAGE_FORMAT.PNG, IMAGE_SIZE.XXX_LARGE);
                const embed = new Embed();
                embed.image?.setUrl(url)
                embed.setUrl(sameUrl);
                interactionResponse.data?.addEmbed(embed);
            }
            if (guild.discovery_splash) {
                const url = buildDiscordImageUrl(['discovery-splashes', guild.id, guild.discovery_splash], IMAGE_FORMAT.PNG, IMAGE_SIZE.XXX_LARGE);
                const embed = new Embed();
                embed.image?.setUrl(url);
                embed.setUrl(sameUrl);
                interactionResponse.data?.addEmbed(embed);
            }
            if (guild.banner) {
                const format = guild.banner.startsWith('a_') ? IMAGE_FORMAT.GIF : IMAGE_FORMAT.PNG;
                const url = buildDiscordImageUrl(['banners', guild.id, guild.banner], format, IMAGE_SIZE.XXX_LARGE);
                const embed = new Embed();
                embed.image?.setUrl(url);
                embed.setUrl(sameUrl);
                interactionResponse.data?.addEmbed(embed);
            }
            break;
        }
        case 'thread': {
            const channelId = interaction.channel_id;
            const channelType = interaction.channel.type;
            const guildId = interaction.guild_id;
            if (!channelId || channelType == null || channelType != CHANNEL_TYPE.PUBLIC_THREAD) {
                interactionResponse.data?.setContent('Error: Must be used in public threads.');
                interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
                return interactionResponse;
            }
            const channel = new Channel(channelId, channelType);
            channel.assignObject(interaction.channel);
            const embed = new Embed();
            embed.setTitle('Thread Info');
            const url = `https://discord.com/channels/${guildId}/${channelId}`;
            embed.setUrl(url);
            embed.addField('Name', channel.name, true);
            embed.addField('Creator', buildUser(channel.owner_id), true);
            embed.addBlankField();
            if (channel.message_count && channel.total_message_sent) {
                const deletedMessagesCount = Math.abs(channel.total_message_sent - channel.message_count);
                embed.addField('Deleted messages', deletedMessagesCount.toString(), true);
                embed.addField('Total messages', channel.message_count.toString(), true);
            }
            const snowflake = new Snowflake(channel.id);
            const created = new Date(snowflake.timestamp);
            embed.addField('Created', created.toString());
            interactionResponse.data?.addEmbed(embed);
            break;
        }
        case 'user': {
            const userId = interaction.data.options[0].options[0].value;
            const guildId = interaction.guild_id;
            const channelId = interaction.channel_id;
            const resolvedMember = guildId ? interaction.data.resolved.members[userId] : null;
            const guildMember = new GuildMember();
            guildMember.assignObject(resolvedMember);
            if (!userId) {
                interactionResponse.data?.setContent('Error: Must be a valid user.');
                interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
                return interactionResponse;
            }
            const url = buildDiscordAPIUrl(['users', userId], []);
            const response = await fetch(url, {
                headers: headers
            });
            if (!response.ok) {
                const error = await getFetchErrorText(response);
                console.error(error);
                interactionResponse.data?.setContent('Error: Something went wrong. Please try again later.');
                interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
                return interactionResponse;
            }
            const data = await response.json();
            const user = new User(data.id, data.string, data.discriminator);
            user.assignObject(data);
            const embed = new Embed();
            embed.setTitle('User Info');
            const sameUrl = `https://discord.com/channels/${guildId}/${channelId}`; // Embeds having the same URL allows an embed to have multiple images for whatever reason...
            embed.setUrl(sameUrl);
            embed.setDescription(`${buildUser(user.id)} ${user.premium_type == USER_PREMIUM_TYPE.NONE ? '' : ':whale:'}`);
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
            const snowflake = new Snowflake(user.id);
            const joinedDiscord = new Date(snowflake.timestamp);
            embed.addField('Joined Discord', joinedDiscord.toString(), true);
            if (guildMember.communication_disabled_until) {
                const timeoutExpires = new Date(guildMember.communication_disabled_until);
                embed.addField('Timeout expires', timeoutExpires.toString(), true);
            }
            interactionResponse.data?.addEmbed(embed);
            if (guildMember.avatar) {
                const format = guildMember.avatar.startsWith('a_') ? IMAGE_FORMAT.GIF : IMAGE_FORMAT.PNG;
                const url = buildDiscordImageUrl(['guilds', interaction.guild_id, 'users', userId, 'avatars', guildMember.avatar], format, IMAGE_SIZE.XXX_LARGE);
                const embed = new Embed();
                embed.image?.setUrl(url);
                embed.setUrl(sameUrl);
                interactionResponse.data?.addEmbed(embed);
            }
            if (user.avatar) {
                const format = user.avatar.startsWith('a_') ? IMAGE_FORMAT.GIF : IMAGE_FORMAT.PNG;
                const url = buildDiscordImageUrl(['avatars', userId, user.avatar], format, IMAGE_SIZE.XXX_LARGE);
                const embed = new Embed();
                embed.image?.setUrl(url);
                embed.setUrl(sameUrl);
                interactionResponse.data?.addEmbed(embed);
            }
            if (user.avatar_decoration) {
                const url = buildDiscordImageUrl(['avatar-decorations', userId, user.avatar_decoration], IMAGE_FORMAT.PNG, IMAGE_SIZE.XXX_LARGE);
                const embed = new Embed();
                embed.image?.setUrl(url);
                embed.setUrl(sameUrl);
                interactionResponse.data?.addEmbed(embed);
            }
            if (user.banner) {
                const format = user.banner.startsWith('a_') ? IMAGE_FORMAT.GIF : IMAGE_FORMAT.PNG;
                const url = buildDiscordImageUrl(['banners', userId, user.banner], format, IMAGE_SIZE.XXX_LARGE);
                const embed = new Embed();
                embed.image?.setUrl(url);
                embed.setUrl(sameUrl);
                interactionResponse.data?.addEmbed(embed);
            }
            break;
        }
        default: {
            interactionResponse.data?.setContent('Error: Incorrect subcommand.')
            interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
            return interactionResponse;
        }
    }
    return interactionResponse;
}

/**
 * Info Command
 */
export const Info = new Command(applicationCommand, execute);
