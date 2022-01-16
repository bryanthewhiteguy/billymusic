const Discord = require(`discord.js`)

module.exports = {
    name: 'skip',
    description: `Skips the current song.`,
    aliases: ["s"],
    category: `music`,
    async execute(msg, args, client, exampleMessage, billyID) {

        let { servers, Player } = require("../index");

        if (!servers[msg.guild.id] || servers[msg.guild.id].queue.length === 0) return msg.channel.send(`There are no songs playing right now.🤓`);
        if (Player[msg.guild.id] === undefined || Player[msg.guild.id] === null) return msg.channel.send("An error occured while attemping to skip.");

        Player[msg.guild.id].stop();

        msg.channel.send("Skipped.");
    }
}