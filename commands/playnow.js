const Discord = require(`discord.js`)
const { play, processQuery } = require("./play");

module.exports = {
    name: 'playnow',
    description: `Skip the queue and play a song immediately.`,
    aliases: ["pn", "pnow"],
    category: `music`,
    async execute(msg, args, client, exampleMessage, billyID) {

        let { servers, Player } = require("../index");

        if (!servers[msg.guild.id]) servers[msg.guild.id] = {
            queue: [],
            previousQueue: [],
            skipping: false,
            queueing: false,
            previous: false,
            playNow: false,
            seek: null,
            loop: false,
            connection: null,
            resource: null
        }

        servers[msg.guild.id].playNow = true;

        processQuery( msg, args, client, exampleMessage, billyID );
    }
}