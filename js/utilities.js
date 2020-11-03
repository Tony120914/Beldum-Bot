const { prefix } = require('../config.json');

module.exports = {

    // Function to fetch all server counts from every shard
    Fetch_Server_Counts: async (client) => {
        const server_count = await client.shard.fetchClientValues('guilds.cache.size')
        .then(counts => { return counts.reduce((acc, count) => acc + count, 0) })
        .catch(console.error);

        return server_count;
    },

    // Inclusive random integers
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    Get_Random_Int: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Replies and log successful command
    Reply_Successful_Command: (reply, message) => {
        message.reply(reply)
        .then(() => console.log(`Successful command reply to: ${message.content}`))
        .catch(console.error);
    },

    // Replies with usage when command is used incorrectly and log it
    Reply_Usage_Error: (message, command_name, command_usage, extra='') => {
        message.reply(`_Beldum Beldum_ :anger: \`${prefix}${command_name} ${command_usage}\` ${extra}`)
        .then(() => console.log(`Usage error reply to: ${message.content}`))
        .catch(console.error);
    }
}

// Template for embeded
/*
const embed = new MessageEmbed()
.setAuthor('Author', iconUrl='https://i.imgur.com/wSTFkRM.png', 'https://google.ca/#author')
.setTitle("Title") // I don't like how it's a different font size
.setURL('https://google.ca/#url')
.setDescription('Description')
.addField('Field Header', 'Field description')
.addField('Field Header', 'Field description')
.addField('\u200b', '\u200b') // blank field
.addField('Field Header', 'Field description (inline)', inline=true)
.addField('Field Header', 'Field description (inline)', inline=true)
.setImage('https://i.imgur.com/wSTFkRM.png')
.setFooter("Footer", iconUrl='https://i.imgur.com/wSTFkRM.png')
.setTimestamp()
.setThumbnail('https://i.imgur.com/wSTFkRM.png')
.setColor('DARK_GOLD');
*/
