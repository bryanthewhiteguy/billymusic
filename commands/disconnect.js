let { servers } = require("../index");

module.exports = {
    name: 'disconnect',
    description: `Makes the bot leave the voice chat.`,
    aliases: ["dc", "leave"],
    category: `music`,
    async execute(msg, args, client, exampleMessage, billyID) {

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

        const clientMember = msg.guild.members.cache.find(m => m.id === client.user.id);

        if (!clientMember.voice.channel) return msg.channel.send("I am not currently in a voice chat.");
        if (servers[msg.guild.id].connection === null) return msg.channel.send("An error occured while trying to leave.");

        servers[msg.guild.id].connection.destroy();
        servers[msg.guild.id].queue = [];

        servers[msg.guild.id].connection = null;

        msg.channel.send("Successfully left the voice chat.");
    }
}