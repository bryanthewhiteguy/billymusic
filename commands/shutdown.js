const Discord = require(`discord.js`)

module.exports = {
    name: 'shutdown',
    description: `shutdown the bot.`,
    access: `Bot owner.`,
    category: `owner`,
    execute(msg, args, client, exampleMessage, billyID) {
        if (msg.author.id !== billyID) return msg.channel.send(`nah`)

        process.exit()
    }
}