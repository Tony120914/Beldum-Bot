const { MessageEmbed } = require("discord.js");
const { default_embed_color, collections } = require('../../config.json');
const { Reply_Successful_Command, Reply_Usage_Error } = require('../utilities.js');
const mongodb = require("../mongodb.js");

const remindme_message_limit = 500;
const remindme_count_limit = 10;
const remindme_min_minutes = 5;
const modes = {
    utc: 'utc',
    show: 'show',
    remove: 'remove'
};

module.exports = {
  name: 'remindme',
  aliases: ['remind', 'reminder', 'stickynote'],
  description: '**BETA** Reminds you of the specified reminder at the specified time (you can only have up to 10 reminders).',
  args: true,
  usage: '<?d?h?m> <reminder>\n//remindme utc <offset>\n//remindme show\n//remindme remove <reminder# or all>',
  
  async execute(message, arguments) {

    const users = mongodb.get_collection(collections.users);
    const reminders = mongodb.get_collection(collections.reminders);
    const reminders_clone = mongodb.get_collection(collections.reminders_clone);

    const mode = arguments[0];
    
    // MODE: utc
    if (mode == modes.utc) {
        // utc input valid check
        const offset_lower_limit = -12.0;
        const offset_upper_limit = +14.0;
        const offset = parseFloat(arguments[1]);
        if (isNaN(offset) || offset < offset_lower_limit || offset > offset_upper_limit) {
            Reply_Usage_Error(message, this.name, this.usage, `\n(UTC timezone offsets can be numbers only between ${offset_lower_limit} and ${offset_upper_limit} inclusively)`);
            return;
        }

        // upsert utc timezone
        const query = { user_id: message.author.id };
        const update = {
            $set: {
                user_id: message.author.id,
                utc: offset,
            }
        };
        const options = { upsert: true };
        await users.updateOne(query, update, options)
        .then(() => {
            let date = new Date();
            date.setHours(date.getHours() + offset);
            Reply_Successful_Command(`\nYour time zone is set to **UTC ${offset}**.\nIt should be **${date.toDateString()} ${date.toLocaleTimeString()}** for you right now.\n(Does not account for daylight savings.)`, message);
            console.log(`Successful upsert UTC: ${offset} for user id: ${message.author.id}`)
        })
        .catch(console.err);

        return;
    }

    // get user info and their reminders
    const user = await users.findOne({
        user_id: message.author.id,
        utc: { $exists : true },
    });
    const user_reminders_cursor = await reminders.find({ user_id: message.author.id }).sort({ date: 1 }); // sort by date desc
    var user_reminders = []
    await user_reminders_cursor.forEach(doc => user_reminders.push(doc));
    user_reminders_cursor.close();

    // Check if the user has registered their timezone or not before proceeding to the reminder functions
    if (!user || user.utc === undefined) {
        Reply_Successful_Command(`Please register your personal time zone using the command \`//remindme utc <offset>\` to use the reminder command.`, message);
        return;
    }

    // MODE: show
    if (mode == modes.show) {
        const embed = new MessageEmbed()
        .setDescription(`<@${message.author.id}>'s reminders`)
        .addField("Time zone", `UTC ${user.utc}`)
        .setColor(default_embed_color);

        //populate reminders to show
        for (let i = 0; i < user_reminders.length; i++) {
            let date = user_reminders[i].date;
            date.setHours(date.getHours() + user.utc);
            let reminder = user_reminders[i].reminder;
            embed.addField(`Reminder #${i+1}: ${date.toDateString()} ${date.toLocaleTimeString()}`, reminder)
        }

        Reply_Successful_Command(embed, message);
        return;
    }
    // MODE: remove
    else if (mode == modes.remove) {

        let number = arguments[1];

        // remove all reminders
        if (number == "all") {
            const query = {
                user_id: message.author.id,
            };

            // remove all copies of reminders first so it doesn't trigger the watch
            await reminders_clone.deleteMany(query)
            .then(() => console.log(`Successful all reminder copies removal`))
            .catch(console.err);

            // then remove all originals
            await reminders.deleteMany(query)
            .then(() => {
                Reply_Successful_Command("All your reminders have been removed", message);
                console.log(`Successful all reminder removal for user id: ${message.author.id}`)
            })
            .catch(console.err);

            return;
        }

        number = parseInt(number);
        if (isNaN(number)) {
            Reply_Usage_Error(message, this.name, this.usage, "\nWhich reminder number do you want to remove?");
            return;
        }
        else if (number >= 1 && number <= user_reminders.length) {
            // remove specific reminder
            const to_remove = { _id: user_reminders[number-1]._id };

            // remove specific reminder copy first so it doesn't trigger the watch
            await reminders_clone.deleteOne(to_remove)
            .then(() => console.log(`Successful single reminder copy removal`))
            .catch(console.err);
            
            // then remove the original
            await reminders.deleteOne(to_remove)
            .then(() => {
                Reply_Successful_Command(`Reminder #${number} has been removed.`, message);
                console.log(`Successful single reminder removal for user id: ${message.author.id}`)
            })
            .catch(console.err);

            return;
        }
        else {
            Reply_Successful_Command("Invalid reminder number", message);
            return;
        }
    }
    
    // check if the user has hit the reminder count limit
    if (user_reminders && user_reminders.length >= remindme_count_limit) {
        Reply_Successful_Command(`You cannot have more than ${remindme_count_limit} reminders.`, message);
        return;
    }
    
    // ?d?h?m format
    if (/^(\d+d)?(\d+h)?(\d+m)?$/.test(mode)) {
        // parse reminder
        const reminder = arguments.slice(1).join(' ').slice(0, remindme_message_limit);
        if (!reminder) {
            Reply_Usage_Error(message, this.name, this.usage, "\nYou want me to remind you to do what?");
            return;
        }

        // parse days/hours/minutes
        let days = mode.match(/\d+d/);
        let hours = mode.match(/\d+h/);
        let minutes = mode.match(/\d+m/);

        // reminder offset from current time
        let date = new Date();
        if (days) {
            days = parseInt(days[0].slice(0, -1));
            date.setDate(date.getDate() + days);
        }
        if (hours) {
            hours = parseInt(hours[0].slice(0, -1));
            date.setHours(date.getHours() + hours);
        }
        if (minutes) {
            minutes = parseInt(minutes[0].slice(0, -1));
            date.setMinutes(date.getMinutes() + minutes);
        }

        // make sure the reminder is at least some minutes
        let date2 = new Date();
        let diff = Math.abs(date2 - date) / 1000 / 60;
        if (diff < remindme_min_minutes - 1) {
            Reply_Successful_Command(`Reminder must be at least ${remindme_min_minutes} minutes.`, message)
            return;
        }

        // insert reminder
        const insert = {
            user_id: message.author.id,
            channel_id: message.channel.id,
            date: date,
            reminder: reminder,
        };
        await reminders.insertOne(insert)
        .then(() => {
            date.setHours(date.getHours() + user.utc);
            const embed = new MessageEmbed()
            .setDescription(`<@${message.author.id}>\nYour reminder has been set for:`)
            .addField("Date and time", `${date.toDateString()} ${date.toLocaleTimeString()}`)
            .addField("Reminder", reminder)
            .setThumbnail("https://github.com/Tony120914/Beldum-Bot/blob/master/images/remindme_sticky_note.png?raw=true")
            .setColor(default_embed_color);
            Reply_Successful_Command(embed, message);
            console.log(`Successful reminder for user id: ${message.author.id} in channel id: ${message.channel.id}`)
        })
        .catch(console.err);
        // send a copy of the reminder for the watch
        await reminders_clone.insertOne(insert)
        .then(() => console.log(`Successful reminder copy uploaded`))
        .catch(console.err);
    }
    // ?am/pm format
    else if (/TODO/.test(mode)) {
        // TODO
    }
    // wrong mode
    else {
        Reply_Usage_Error(message, this.name, this.usage);
        return;
    }

    
  }

}
