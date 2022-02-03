const Discord = require(`discord.js`)
const moment = require(`moment`)
require(`moment-duration-format`)

const { play } = require("./play");

module.exports = {
    name: 'seek',
    description: `Seeks to a certain position in the song.`,
    usage: "(time in seconds)",
    category: `music`,
    async execute(msg, args, client, exampleMessage, billyID) {

        let { servers, Player } = require("../index");

        if (!servers[msg.guild.id] || servers[msg.guild.id].queue.length === 0) return msg.channel.send(`There are no songs playing right now.🤓`);
        if (Player[msg.guild.id] === undefined || Player[msg.guild.id] === null) return msg.channel.send("An error occured while attemping to skip.");
        if (!args[1]) return msg.channel.send(`Please enter the position you want to seek in the song.${exampleMessage()}`);
        if (isNaN(args[1])) return msg.channel.send(`Please enter a valid number.${exampleMessage()}`);

        let time = Number(args[1]);
        const milliseconds = time * 1000;

        servers[msg.guild.id].seek = time;
        Player[msg.guild.id].stop();

        if (milliseconds < 60000) {
            time = moment.duration(milliseconds).format(`ss`)
        } else if (milliseconds < 3600000) {
            time = moment.duration(milliseconds).format(`mm:ss`)
        } else {
            time = moment.duration(milliseconds).format(`hh:mm:ss`)
        }

        msg.channel.send(`Seeked to \`${time}\`.`);
    }
}