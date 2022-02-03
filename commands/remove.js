const Discord = require(`discord.js`)
const { play } = require("./play");
const { arrayshuffle } = require("../functions");

module.exports = {
    name: 'remove',
    description: `Remove a specific song from the queue.`,
    usage: "(position in queue)",
    category: `music`,
    async execute(msg, args, client, exampleMessage, billyID) {

        let { servers, Player } = require("../index");

        if (!servers[msg.guild.id] || servers[msg.guild.id].queue.length === 0) return msg.channel.send(`There are no songs playing right now.🤓`);
        if (Player[msg.guild.id] === undefined || Player[msg.guild.id] === null) return msg.channel.send("An error occured while attemping to remove.");
        if (!args[1]) return msg.channel.send(`You need to provide a position in the queue to remove from.${exampleMessage()}`);
        if (isNaN(args[1]) || args[1] <= 0 || args[1] > servers[msg.guild.id].queue.length - 1) return msg.channel.send(`You need to provide a valid position.${exampleMessage()}`);

        const songInfo = servers[msg.guild.id].queue[args[1]];

        servers[msg.guild.id].queue.splice(args[1], 1);

        msg.channel.send(`Successfully removed **${songInfo.title}** from the queue.`);
    }
}