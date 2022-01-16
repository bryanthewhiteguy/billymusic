const Discord = require('discord.js');
const { DisTube } = require("distube");
const { prefix, urloptions } = require("./botconfig.json")

const token = process.env.TOKEN || require("./botconfig.json").token;

const { SpotifyPlugin } = require("@distube/spotify")
const { SoundCloudPlugin } = require("@distube/soundcloud")

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES
    ]
})

client.login(token);

const fs = require(`fs`)
const ms = require(`ms`)

const billyID = `303195470568751108`

let Player = [];
let servers = {};
let currentlyPlaying = {};

module.exports = { servers, Player };

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.cooldowns = new Discord.Collection()
client.globalTimeout = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
    if (command.aliases) command.aliases.forEach(a => client.aliases.set(a, command));
}

client.on(`ready`, () => {
    require(`./events/client/ready`)(client, prefix)
})

client.on(`message`, msg => {
    require(`./events/client/message`)(billyID, client, prefix, msg)
})
