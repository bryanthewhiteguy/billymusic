let { servers } = require("../index");

const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require("@discordjs/voice")

module.exports = {
    name: 'join',
    description: `Makes the bot join the current voice chat.`,
    category: `music`,
    async execute(msg, args, client, exampleMessage, billyID) {

        if (!servers[msg.guild.id]) servers[msg.guild.id] = {
            queue: [],
            previousQueue: [],
            skipping: false,
            queueing: false,
            previous: false,
            playNow: false,
            seek: null,
            loop: false,
            connection: null,
            resource: null
        }

        if (!msg.member.voice.channel) return msg.channel.send("You need to be in a voice chat in order for the bot to join.");
        let theVC = msg.member.voice.channel

        const permissions = theVC.permissionsFor(client.user);

        if (!permissions.has(`CONNECT`) || !permissions.has(`SPEAK`)) return msg.channel.send(`**I don't have permissions to either connect or speak in this voice channel.**\n\nPlease make sure I have both if you want the command to execute.${exampleMessage()}`)
        if (theVC.full) return msg.channel.send(`The current voice chat you're in is full.`)

        const clientMember = msg.guild.members.cache.find(m => m.id === client.user.id);

        if (clientMember.voice.channel) return msg.channel.send("I am already in a voice channel.");

        const connection = joinVoiceChannel({
            channelId: theVC.id,
            guildId: theVC.guild.id,
            adapterCreator: msg.guild.voiceAdapterCreator
        });

        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        } catch (error) {
            connection.destroy();
            throw error;
        }

        servers[msg.guild.id].connection = connection;

        msg.channel.send("Successfully joined your channel.");
    }
}