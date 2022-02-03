const { MessageEmbed } = require(`discord.js`);
const { pages } = require("../functions");
const urloptions = { "format": "png", "dynamic": true };

module.exports = {
    name: 'queue',
    description: `Get the music queue.`,
    aliases: ["q", "songlist"],
    category: `music`,
    execute(msg, args, client, exampleMessage, billyID) {

        let { servers, Player } = require("../index");

        let queue;
        if (servers[msg.guild.id]) queue = servers[msg.guild.id].queue;

        const filter = (reaction, User) => User.id === msg.author.id && [`▶️`, `◀️`].includes(reaction.emoji.name)

        if (queue === undefined || queue.length === 0) return msg.channel.send(`There are no songs playing right now.🤓`);

        const q = queue
            .map((song, i) => `${i === 0 ? "**Playing:**" : `**${i}**.`} ${song.title} - \`${song.time}\` - ${song.author}${i === 0 ? "\n" : ""}`);

        const totalPages = Math.ceil(q.length / 10)

        let pageNumber = 1;
        let page = pages(q, 10, pageNumber)

        const embed = new MessageEmbed()
            .setColor(808080)
            .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL(urloptions) })
            .setTitle(`Music queue:`)
            .setDescription(`${page.join(`\n`)}`)
            .setFooter({ text: `Page: (${pageNumber}/${totalPages})`, iconURL: client.user.displayAvatarURL(urloptions) });

        msg.channel.send({ embeds: [embed] }).then(async (message) => {
            await message.react(`◀️`)
            message.react(`▶️`)

            const collector = message.createReactionCollector({ filter, time: 300000, idle: 60000, dispose: true });

            function movePage(page) {
    
                message.edit({
                    embeds: [embed
                        .setDescription(`${page.join(`\n`)}`)
                        .setFooter({ text: `Page: (${pageNumber}/${totalPages})`, iconURL: client.user.displayAvatarURL(urloptions) })]
                    })
            }

            collector.on(`remove`, r => {

                const forwards = r.emoji.name === "▶️" ? true : false;

                if (pageNumber !== (forwards ? totalPages : 1)) {

                    forwards ? pageNumber++ : pageNumber--;

                    page = pages(q, (pageNumber === 1 ? 11 : 10), pageNumber);

                    movePage(page);
                }
            })

            collector.on(`collect`, r => {

                const forwards = r.emoji.name === "▶️" ? true : false;

                if (pageNumber !== (forwards ? totalPages : 1)) {

                    forwards ? pageNumber++ : pageNumber--;

                    page = pages(q, (pageNumber === 1 ? 11 : 10), pageNumber);

                    movePage(page);
                }
            })
        }).catch((e) => {
            console.log(e)
            return msg.channel.send(`An error occured.`)
        })
    }
}