const Discord = require(`discord.js`)
const { urloptions } = require(`../botconfig.json`)

module.exports = {
    name: 'setavatar',
    description: `Sets the new avatar for the bot.`,
    usage: `(attached image from device)`,
    access: `Bot owner.`,
    category: `owner`,
    async execute(msg, args, client, exampleMessage, billyID) {

        const image = msg.attachments.first();

        if (msg.author.id !== billyID) return msg.channel.send(`nah`)
        if (!image) return msg.channel.send(`You have to attach an image to change the bot's avatar.${exampleMessage()}`)

        const avatarEmbed = new Discord.MessageEmbed()
            .setColor(808080)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL( urloptions ))
            .setThumbnail(client.user.displayAvatarURL( urloptions ))
            .setTitle(`${client.user.username}'s avatar has been changed!`)
            .setImage(image.proxyURL)

        await msg.channel.send({embeds: [avatarEmbed]});

        client.user.setAvatar(image.proxyURL)
    }
}