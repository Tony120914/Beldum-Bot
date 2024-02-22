import { ApplicationCommand, ApplicationCommandOption } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_OPTION_TYPE, APPLICATION_COMMAND_TYPE, CHANNEL_TYPE, IMAGE_FORMAT, IMAGE_SIZE, INTERACTION_RESPONSE_FLAGS, INTERACTION_RESPONSE_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { buildDiscordAPIUrl, buildDiscordImageUrl, buildEmoji, buildRole, buildUser, parseEmoji } from '../handlers/MessageHandler.js';
import { getFetchErrorText } from '../handlers/ErrorHandler.js';
import { Role } from '../templates/discord/PermissionsResource.js';
import { Guild, GuildMember } from '../templates/discord/GuildResource.js';
import { Snowflake } from '../templates/discord/Snowflake.js';
import { Channel } from '../templates/discord/ChannelResources.js';
import { User } from '../templates/discord/UserResource.js';

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
    'Get Beldum Bot\'s information and images.',
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
const roleIconOption = new ApplicationCommandOption(
    'role',
    'Get a role\'s information and image.',
    APPLICATION_COMMAND_OPTION_TYPE.SUB_COMMAND
);
const roleInputOption = new ApplicationCommandOption(
    'role',
    'The desired role',
    APPLICATION_COMMAND_OPTION_TYPE.ROLE
);
roleInputOption.setRequired(true);
roleIconOption.addOption(roleInputOption);
applicationCommand.addOptions(roleIconOption);

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

const execute = async function(interaction: any, env: any) {
    const interactionResponse = new InteractionResponse(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    const subcommand = interaction.data.options[0].name;
    switch (subcommand) {
        case 'bot': {
            // TODO
            break;
        }
        case 'channel': {
            const channelId = interaction.channel_id;
            const channelType = interaction.channel.type;
            const guildId = interaction.guild_id;
            if (!channelId || channelType == null || channelType == CHANNEL_TYPE.PUBLIC_THREAD || channelType == CHANNEL_TYPE.PRIVATE_THREAD) {
                interactionResponse.data?.setContent('Error: Must be used in channels.');
                interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
                return interactionResponse;
            }
            const channel = new Channel(channelId, channelType);
            channel.assignObject(interaction.channel);
            const embed = new Embed();
            embed.setTitle('Channel Info');
            const url = `https://discord.com/channels/${guildId}/${channelId}`;
            embed.setUrl(url);
            embed.setDescription(`${channel.topic}`);
            embed.addField('name', `${channel.name}`, true);
            const snowflake = new Snowflake(channel.id);
            const createdOn = new Date(snowflake.timestamp);
            embed.addField('created on', `${createdOn}`);
            interactionResponse.data?.addEmbed(embed);
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
            embed.setDescription(emojiString);
            embed.addField('name', emoji.name, true);
            const snowflake = new Snowflake(emoji.id);
            const createdOn = new Date(snowflake.timestamp);
            embed.addField('created on', `${createdOn}`, true);
            const format = emoji.animated ? IMAGE_FORMAT.GIF : IMAGE_FORMAT.PNG
            const url = buildDiscordImageUrl(['emojis', emoji.id], format, IMAGE_SIZE.XXX_LARGE);
            embed.image?.setUrl(url);
            interactionResponse.data?.addEmbed(embed);
            break;
        }
        case 'role': {
            const roleId = interaction.data.options[0].options[0].value;
            const roleData = interaction.data.resolved.roles[roleId];
            if (!roleId || !roleData) {
                interactionResponse.data?.setContent('Error: Must be a valid role.');
                interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
                return interactionResponse;
            }
            const role = new Role(roleData.id, roleData.name);
            role.assignObject(roleData);
            const embed = new Embed();
            embed.setTitle('Role Info');
            embed.setDescription(`${role.unicode_emoji || ''} ${buildRole(roleId)}`);
            embed.addField('name', role.name, true);
            const snowflake = new Snowflake(role.id);
            const createdOn = new Date(snowflake.timestamp);
            embed.addField('created on', `${createdOn}`, true);
            if (role.icon) {
                const url = buildDiscordImageUrl(['role-icons', role.id, role.icon], IMAGE_FORMAT.PNG, IMAGE_SIZE.XXX_LARGE);
                embed.image?.setUrl(url);
            }
            interactionResponse.data?.addEmbed(embed);
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
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bot ${env.DISCORD_TOKEN}`,
                },
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
            const sameUrl = `https://discord.com/channels/${guildId}/${channelId}`; // Same url = allows embed with multiple images for whatever reason...
            embed.setUrl(sameUrl);
            embed.setDescription(guild.description || '');
            embed.addField('name', guild.name, true);
            embed.addField('owner', buildUser(guild.owner_id), true);
            embed.addField('users online / total users (approx)', `${guild.approximate_presence_count} / ${guild.approximate_member_count}`, true);
            embed.addField('', '');
            embed.addField('server boost level', `${guild.premium_tier}`, true);
            embed.addField('number of boosts', `${guild.premium_subscription_count}`, true);
            let roles = '';
            guild.roles.forEach(role => {
                roles += `${buildRole(role.id)} `;
            });
            embed.addField('roles', roles);
            let emojis = '';
            guild.emojis.forEach(emoji => {
                emojis += `${buildEmoji(emoji.name, emoji.id, emoji.animated)} `;
            });
            embed.addField('emojis', emojis);
            const snowflake = new Snowflake(guild.id);
            const createdOn = new Date(snowflake.timestamp);
            embed.addField('created on', `${createdOn}`);
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
            if (!channelId || channelType == null || channelType != CHANNEL_TYPE.PUBLIC_THREAD) {
                interactionResponse.data?.setContent('Error: Must be used in public threads.');
                interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
                return interactionResponse;
            }
            const channel = new Channel(channelId, channelType);
            channel.assignObject(interaction.channel);
            const embed = new Embed();
            embed.setTitle('Thread Info');
            embed.addField('name', `${channel.name}`, true);
            embed.addField('creator', buildUser(`${channel.owner_id}`), true);
            embed.addField('', '');
            if (channel.message_count && channel.total_message_sent) {
                embed.addField('total messages', `${channel.message_count}`, true);
                const deletedMessagesCount = Math.abs(channel.total_message_sent - channel.message_count);
                embed.addField('deleted messages', `${deletedMessagesCount}`, true);
            }
            const snowflake = new Snowflake(channel.id);
            const createdOn = new Date(snowflake.timestamp);
            embed.addField('created on', `${createdOn}`);
            interactionResponse.data?.addEmbed(embed);
            break;
        }
        case 'user': {
            // TODO HERE
            const userId = interaction.data.options[0].options[0].value;
            const resolvedMember = interaction.data.resolved.members[userId];
            const guildMember = new GuildMember();
            const guildId = interaction.guild_id;
            const channelId = interaction.channel_id;
            guildMember.assignObject(resolvedMember);
            if (!userId) {
                interactionResponse.data?.setContent('Error: Must be a valid user.');
                interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
                return interactionResponse;
            }
            const url = buildDiscordAPIUrl(['users', userId], []);
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bot ${env.DISCORD_TOKEN}`,
                },
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
            embed.setTitle('User');
            const sameUrl = `https://discord.com/channels/${guildId}/${channelId}`; // Same url = allows embed with multiple images for whatever reason...
            embed.setUrl(sameUrl);
            if (guildMember.nick) { embed.addField('nickname', `${guildMember.nick}`, true); }
            if (user.global_name) { embed.addField('display name', `${user.global_name}`, true); }
            if (user.username) { embed.addField('username', user.username, true); }
            if (user.discriminator != '0') { embed.addField('#', `${user.discriminator}`, true); }
            let roles = '';
            guildMember.roles.forEach(roleId => {
                roles += `${buildRole(roleId)} `;
            });
            embed.addField('roles', roles);
            const joinedServerOn = new Date(guildMember.joined_at);
            embed.addField('joined server on', `${joinedServerOn}`, true);
            if (guildMember.premium_since) {
                const boosterSince = new Date(guildMember.premium_since);
                embed.addField('booster since', `${boosterSince}`, true);
            }
            embed.addField('', '');
            const snowflake = new Snowflake(user.id);
            const joinedDiscordOn = new Date(snowflake.timestamp);
            embed.addField('joined Discord on', `${joinedDiscordOn}`, true);
            if (guildMember.communication_disabled_until) {
                const timeoutExpiresOn = new Date(guildMember.communication_disabled_until);
                embed.addField('timeout expires', `${timeoutExpiresOn}`, true);
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
