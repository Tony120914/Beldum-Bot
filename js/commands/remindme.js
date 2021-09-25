const { MessageEmbed } = require("discord.js");
const { prefix, default_embed_color, mongodb_collections } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const mongodb = require("../mongodb.js");
const chrono = require('chrono-node');
const log = require("loglevel");

const message_limit = 500;
const count_limit = 10;
const min_minutes = 5;
const modes = {
  set: 'set',
  show: 'show',
  remove: 'remove',
  utc: 'utc'
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remindme')
    .setDescription('Set or manage your reminders')
    .addSubcommand(option =>
      option.setName('set')
        .setDescription('set a new reminder')
        .addStringOption(option =>
          option.setName('reminder')
            .setDescription('the reminder')
            .setRequired(true)))
    .addSubcommand(option =>
      option.setName('show')
        .setDescription('show all active reminders'))
    .addSubcommand(option =>
      option.setName('remove')
        .setDescription('remove an active reminder')
        .addIntegerOption(option =>
          option.setName('remindernumber')
            .setDescription('the active reminder number to remove')
            .setRequired(true)))
    .addSubcommand(option =>
      option.setName('utc')
        .setDescription('set timezone')
        .addNumberOption(option =>
          option.setName('offset')
            .setDescription('your timezone offset number')
            .setRequired(true))),
  
  async execute(interaction) {
    const users = mongodb.getCollection(mongodb_collections.users);
    const reminders = mongodb.getCollection(mongodb_collections.reminders);
    const reminders_clone = mongodb.getCollection(mongodb_collections.reminders_clone);

    const mode = interaction.options.getSubcommand();
    
    // MODE: utc
    if (mode == modes.utc) {
      const arg1 = interaction.options.getNumber('offset');
      // utc input valid check
      const offset_lower_limit = -12.0;
      const offset_upper_limit = +14.0;
      const offset = arg1;
      if (offset < offset_lower_limit || offset > offset_upper_limit) {
          await interaction.reply({ content: `UTC timezone offsets can only be between ${offset_lower_limit} and ${offset_upper_limit} (inclusively)`, ephemeral: true });
          return;
      }
      // upsert utc timezone
      const query = { user_id: interaction.user.id };
      const update = {
          $set: {
              user_id: interaction.user.id,
              utc: offset,
          }
      };
      const options = { upsert: true };
      await users.updateOne(query, update, options)
      // reply successful time zone change
      let date = new Date();
      date.setHours(date.getHours() + offset);
      const embed = new MessageEmbed()
        .setDescription(`Your time zone is set to **UTC ${offset}**.\nIt should be **${date.toDateString()} ${date.toLocaleTimeString()}** for you right now.\nYou can always change your time zone again with:\n\`/remindme utc <offset>\``)
        .setColor(default_embed_color);
      await interaction.reply({ embeds: [embed] });
      return;
    }

    // get existing user info
    const user = await users.findOne({
        user_id: interaction.user.id,
        utc: { $exists : true },
    });

    // Check if the user has registered their time zone or not before proceeding to the reminder functions
    if (!user || user.utc === undefined) {
      const embed = new MessageEmbed()
        .setDescription(`Please register your time zone with the following command to start using reminders:\n\`/remindme utc <offset>\``)
        .setColor(default_embed_color);
      await interaction.reply({ embeds: [embed] });
      return;
    }

    // get existing user's reminders
    const user_reminders_cursor = await reminders.find({ user_id: interaction.user.id }).sort({ date: 1 }); // sort by date desc
    var user_reminders = []
    await user_reminders_cursor.forEach(doc => user_reminders.push(doc));
    user_reminders_cursor.close();

    // MODE: show
    if (mode == modes.show) {
        let date = new Date();
        date.setHours(date.getHours() + user.utc);

        const embed = new MessageEmbed()
          .setDescription(`${interaction.user}'s reminders`)
          .addField("Time zone", `UTC ${user.utc}, ${date.toDateString()} ${date.toLocaleTimeString()}\n(Wrong? Use \`/remindme utc <offset>\` to change your time zone.)`)
          .setColor(default_embed_color);

        // populate reminders to show
        for (let i = 0; i < user_reminders.length; i++) {
            let date = user_reminders[i].date;
            date.setHours(date.getHours() + user.utc);
            let reminder = user_reminders[i].reminder;
            embed.addField(`Reminder #${i+1}: ${date.toDateString()} ${date.toLocaleTimeString()}`, reminder)
        }
        if (user_reminders.length == 0) {
          embed.addField(`You have no active reminders`, `Add some reminders using \`/remindme set <reminder>\``);
        }
        await interaction.reply({ embeds: [embed] });
        return;
    }
    // MODE: remove
    else if (mode == modes.remove) {
      const arg1 = interaction.options.getInteger('remindernumber');
      const number = arg1;

      if (number < 1 || number > user_reminders.length) {
        await interaction.reply({ content: `Invalid reminder number.`, ephemeral: true });
        return;
      }
      // remove specific reminder copy first so it doesn't trigger the watch
      const to_remove = { _id: user_reminders[number-1]._id };
      await reminders_clone.deleteOne(to_remove);
      await reminders.deleteOne(to_remove)
      const embed = new MessageEmbed()
        .setDescription(`Reminder #${number} has been removed.`)
        .setColor(default_embed_color);
      await interaction.reply({ embeds: [embed] });
      return;
    }

    // MODE: set
    else if (mode == modes.set) {
      // check if the user has hit the reminder count limit
      if (user_reminders && user_reminders.length >= count_limit) {
        await interaction.reply({ content: `You cannot have more than ${count_limit} reminders.`, ephemeral: true });
        return;
      }

      const arg1 = interaction.options.getString('reminder');
      let reminder = arg1.slice(0, message_limit);

      /// NLP parse the reminder with chrono-node

      // Custom refiner to deal with time zones
      // https://github.com/wanasit/chrono/issues/327#issuecomment-626092607
      const custom_chrono = new chrono.Chrono();
      custom_chrono.refiners.push({
        refine: (text, results, options) => {
          results.forEach(r => {
            r.start.imply('timezoneOffset', user.utc * 60);
          });
          return results;
        }
      });

      // parse the reminder 
      const now = new Date();
      // now.setHours(now.getHours() + user.utc);
      const nlp = custom_chrono.parse(reminder, now, { forwardDate: true })[0];
      if (!nlp || !nlp.start) {
          await interaction.reply({ content: `Sorry, I couldn't understand your reminder. Can you please be more concise with the date/time?`, ephemeral: true });
          return;
      }
      const date = nlp.start.date();
      log.debug(`NLP parsed: ${date}`);
      // make sure the reminder is at least some minutes
      let diff = (date - new Date()) / 1000 / 60;
      if (diff < min_minutes - 1) {
        await interaction.reply({ content: `Reminder must be at least ${min_minutes} minutes from now.`, ephemeral: true });
        return;
      }
      // remove the time from the reminder and make sure the reminder isn't empty
      reminder = reminder.replace(nlp.text, '');
      if (!reminder) {
        await interaction.reply({ content: `You forgot to specify what the reminder is.`, ephemeral: true });
        return;
      }

      // insert reminder into db along with a copy for the watch
      const insert = {
        user_id: interaction.user.id,
        channel_id: interaction.channel.id,
        date: date,
        reminder: reminder,
      };
      await reminders.insertOne(insert);
      await reminders_clone.insertOne(insert);

      // reply to successful reminder set
      date.setHours(date.getHours() + user.utc);
      const embed = new MessageEmbed()
        .setDescription(`${interaction.user} Your reminder has been set for:`)
        .addField("Date and time", `${date.toDateString()} ${date.toLocaleTimeString()}`)
        .addField("Reminder", reminder)
        .addField("How to manage reminders?", "`/remindme <subcommand>`")
        .setColor(default_embed_color);
      await interaction.reply({ embeds: [embed] });
    }


  }
}
