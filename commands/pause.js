const Discord = require(`discord.js`)
const { createTimeStamp } = require("../functions");
const { urloptions } = require("../botconfig.json");

module.exports = {
    name: 'pause',
    description: `Pause the current song.`,
    category: `music`,
    async execute(msg, args, client, exampleMessage, billyID) {

        let { servers, Player } = require("../index");

        if (!servers[msg.guild.id] || servers[msg.guild.id].queue.length === 0 || servers[msg.guild.id].resource === null) return msg.channel.send(`There are no songs playing right now.🤓`);
        if (Player[msg.guild.id] === undefined || Player[msg.guild.id] === null) return msg.channel.send("An error occured while attemping to get the current song.");

        Player[msg.guild.id].pause();

        msg.channel.send("Paused song.");
    }
}