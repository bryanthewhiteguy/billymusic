const Discord = require('discord.js');
const { prefix, urloptions } = require(`../botconfig.json`)
const ms = require("ms");

module.exports = {
    name: 'help',
    description: `Displays all commands, or gives information about a specific command.`,
    aliases: [`commands`, `h`],
    category: `information`,
    execute(msg, args, client, exampleMessage, billyID) {

        // const categories = client.commands.map(c => c.category).reduce((a, b) => {
        //     if (a.indexOf(b) < 0) a.push(b)
        //     return a
        // }, []).sort()

        const helpEmbed = new Discord.MessageEmbed()
            .setColor(808080)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL(urloptions))
            .setThumbnail(client.user.displayAvatarURL(urloptions))

        if (!args[1]) {

            helpEmbed.setDescription(`All commands for \`${client.user.username}\` \n\n${client.commands.map(c => `\`${c.name}\``).join(",\n")}`)
            helpEmbed.setFooter(`Total commands: ${client.commands.size}.\nDo "${prefix}help (Command name)" for more information.`, client.user.displayAvatarURL(urloptions))

            return msg.channel.send({embeds: [helpEmbed]}).catch(() => {
                return msg.channel.send(`An error occured.`)
            })
        } else {
            const command = client.commands.get(args[1].toLowerCase()) || client.aliases.get(args[1].toLowerCase())

            if (!command) return msg.channel.send({ embeds: [helpEmbed
                .setTitle("Invalid Command given.")
                .setDescription(`Do \`${prefix}help\` for the list of the commands.`)]})


            helpEmbed.setDescription(`**Command name: \`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\`\nDescription \`${command.description || "No Description provided."}\`\nAccessible by: \`${command.access || `Everyone.`}\`\nUsage: \`${command.usage ? `${prefix}${command.name} ${command.usage}` : "No Usage"}\`\nAliases: \`${command.aliases ? command.aliases.join(", ") : "None."}\`\nCooldown: \`${command.cd ? ms(command.cd, { long: true }) : "None."}\`\nCategory: \`${command.category || `None.`}\`**`)
                .setFooter(`Do "${prefix}help" alone for the full list of commands.`, client.user.displayAvatarURL(urloptions))

            return msg.channel.send({embeds: [helpEmbed]}).catch(() => {
                return msg.channel.send(`An error occured.`)
            })
        }
    }
}