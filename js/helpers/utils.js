
module.exports = {
    // Function to fetch all server counts from every shard
    Fetch_Server_Counts: async function(client) {
        const server_count = await client.shard.fetchClientValues('guilds.size')
        .then(counts => {return counts.reduce((prev, count) => prev + count, 0)})
        .catch(console.error);

        return server_count;
    }
}