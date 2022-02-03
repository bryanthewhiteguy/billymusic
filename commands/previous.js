const Discord = require(`discord.js`)
const { play } = require("./play");

module.exports = {
    name: 'previous',
    description: `Goes back to the last played song.`,
    aliases: ["prev"],
    category: `music`,
    async execute(msg, args, client, exampleMessage, billyID) {

        let { servers, Player } = require("../index");

        if (!servers[msg.guild.id] || servers[msg.guild.id].previousQueue.length === 0) return msg.channel.send("There are no previos songs in the queue.");

        if (servers[msg.guild.id] && servers[msg.guild.id].queue.length === 0) {
            servers[msg.guild.id].queue.push(servers[msg.guild.id].previousQueue[0])
            servers[msg.guild.id].previousQueue.shift();

            let theVC = msg.member.voice.channel

            const permissions = theVC.permissionsFor(client.user);

            if (!permissions.has(`CONNECT`) || !permissions.has(`SPEAK`)) return msg.channel.send(`**I don't have permissions to either connect or speak in this voice channel.**\n\nPlease make sure I have both if you want the command to execute.${exampleMessage()}`)
            if (theVC.full) return msg.channel.send(`The current voice chat you're in is full.`)

            play(msg, theVC);
        } else {
            servers[msg.guild.id].previous = true;
            Player[msg.guild.id].stop();
        }
    }
}