const Discord = require(`discord.js`)
const { urloptions } = require(`../botconfig.json`)

module.exports = {
    name: 'setbotname',
    description: `Sets a new name for the bot.`,
    usage: `(probably some offensive name lol ahahahahha)`,
    access: `Bot owner.`,
    category: `owner`,
    async execute(msg, args, client, exampleMessage, billyID) {

        if (msg.author.id !== billyID) return msg.channel.send(`nah`)
        if (!args[1]) return msg.channel.send(`You have to provide a name.${exampleMessage()}`)

        const oldName = client.user.username
        const newName = args.slice(1).join(` `)

        client.user.setUsername(newName)

        const newNameEmbed = new Discord.MessageEmbed()
            .setColor(808080)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL(urloptions))
            .setThumbnail(client.user.displayAvatarURL(urloptions))
            .setTitle(`New bot name set!!!111!!`)
            .setDescription(`**The bot's new name is now \`${newName}\`.\n\nOld name: \`${oldName}\`\n\nNew name: \`${newName}\`**`)

        msg.channel.send({embeds: [newNameEmbed]});
    }
}