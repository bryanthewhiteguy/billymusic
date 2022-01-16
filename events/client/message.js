const Discord = require(`discord.js`)

module.exports = (billyID, client, prefix, msg) => {

    const { cooldownTime } = require(`../../functions`)

    const Author = msg.author
    const AuthorID = Author.id

    if (AuthorID === billyID && msg.content.toLowerCase() === `shutdown`) {
        process.exit()
    }

    if (msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {

        const trimmedContent = msg.content.replace(/ +(?= )/g, ``)
        const args = trimmedContent.slice(prefix.length).split(" ")
        const command = client.commands.get(args[0].toLowerCase()) || client.aliases.get(args[0].toLowerCase())

        if (!command) return;
        
        if (command.closed === true && msg.author.id !== `303195470568751108`) return msg.channel.send(`❌**This command is currently disabled. Try again later, or tell \`${client.users.cache.find(u => u.id === billyID).tag}\` to hurry up and fix it.**`)

        if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Discord.Collection)

        const exampleMessage = () => {
            client.cooldowns.get(command.name).delete(msg.author.id)

            return `\n\n**Example:**\n\`${prefix}${args[0]} ${command.usage}\``
        }

        const now = Date.now()
        const timestamp = client.cooldowns.get(command.name)
        const cooldownAmount = command.cd || 0

        if (timestamp.has(msg.author.id)) {
            let expirationTime = timestamp.get(msg.author.id) + cooldownAmount

            if (now < expirationTime) {

                const timeLeft = cooldownTime(command.name, client, msg)

                return msg.channel.send(`❌**Slow down ${msg.author.username}.**\n\nPlease wait \`${timeLeft}\` until you can use the \`"${args[0]}"\` command again.`)

            }

        } else {
            timestamp.set(msg.author.id, now)

            setTimeout(() => timestamp.delete(msg.author.id), cooldownAmount)
        }

        client.commands.get(command.name).execute(msg, args, client, exampleMessage, billyID)

    }
}