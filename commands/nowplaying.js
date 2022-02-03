const Discord = require(`discord.js`)
const { createTimeStamp } = require("../functions");
const { urloptions } = require("../botconfig.json");

module.exports = {
    name: 'nowplaying',
    description: `Get the current song playing.`,
    aliases: ["np"],
    category: `music`,
    async execute(msg, args, client, exampleMessage, billyID) {

        let { servers, Player } = require("../index");

        if (!servers[msg.guild.id] || servers[msg.guild.id].queue.length === 0 || servers[msg.guild.id].resource === null) return msg.channel.send(`There are no songs playing right now.🤓`);
        if (Player[msg.guild.id] === undefined || Player[msg.guild.id] === null) return msg.channel.send("An error occured while attemping to get the current song.");

        const songInfo = servers[msg.guild.id].queue[0];

        const formattedTime = createTimeStamp( servers[msg.guild.id].resource.playbackDuration);

        const playingEmbed = new Discord.MessageEmbed()
            .setColor(808080)
            .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL(urloptions) } )
            .setTitle("Currently playing:")
            .setDescription(`[${songInfo.title}](${songInfo.query}) \n\n\`(${formattedTime}/${songInfo.time})\``)
            .setFooter({ text: `${servers[msg.guild.id].queue.length} songs in queue.`})

        msg.channel.send({ embeds: [playingEmbed]});
    }
}