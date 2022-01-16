const Discord = require(`discord.js`)

module.exports = {
    name: 'clear',
    description: `Stops the queue.`,
    aliases: ["stop"],
    category: `music`,
    async execute(msg, args, client, exampleMessage, billyID) {

        let { servers, Player } = require("../index");

        if (!servers[msg.guild.id] || servers[msg.guild.id].queue.length === 0) return msg.channel.send(`There are no songs playing right now.🤓`);
        if (Player[msg.guild.id] === undefined || Player[msg.guild.id] === null) return msg.channel.send("An error occured while attemping to clear.");

        servers[msg.guild.id].queue = [];
        Player[msg.guild.id].stop();
    }
}