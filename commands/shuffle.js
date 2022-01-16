const Discord = require(`discord.js`)
const { play } = require("./play");
const { arrayshuffle } = require("../functions");

module.exports = {
    name: 'shuffle',
    description: `Shuffle all of the songs in the queue.`,
    category: `music`,
    async execute(msg, args, client, exampleMessage, billyID) {

        let { servers, Player } = require("../index");

        if (!servers[msg.guild.id] || servers[msg.guild.id].queue.length === 0) return msg.channel.send(`There are no songs playing right now.🤓`);
        if (Player[msg.guild.id] === undefined || Player[msg.guild.id] === null) return msg.channel.send("An error occured while attemping to clear.");
        if (servers[msg.guild.id].queue.length === 1) return msg.channel.send("Nothing to shuffle in the queue.");

        let queueItems = servers[msg.guild.id].queue.slice(1);

        const newQueue = arrayshuffle(queueItems);

        newQueue.unshift(servers[msg.guild.id].queue[0]);

        servers[msg.guild.id].queue = newQueue;

        msg.channel.send("Successfully shuffled the queue.");
    }
}