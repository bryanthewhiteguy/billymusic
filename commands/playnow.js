const Discord = require(`discord.js`)
const { play, processQuery } = require("./play");

module.exports = {
    name: 'playnow',
    description: `Skip the queue and play a song immediately.`,
    aliases: ["pn"],
    category: `music`,
    async execute(msg, args, client, exampleMessage, billyID) {

        let { servers, Player } = require("../index");

        if (!servers[msg.guild.id]) servers[msg.guild.id] = {
            queue: [],
            previousQueue: [],
            previous: false,
            playNoq: false,
            seek: null,
            loop: false,
            resource: null
        }

        servers[msg.guild.id].playNow = true;

        processQuery( msg, args, client, exampleMessage, billyID );
    }
}