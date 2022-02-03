const Discord = require(`discord.js`);
const ytdlCore = require("ytdl-core");
const pdl = require("play-dl");
const ytSearch = require("yt-search");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, AudioPlayer, AudioPlayerStatus } = require("@discordjs/voice")
const { getData, getPreview, getTracks } = require("spotify-url-info");
const moment = require(`moment`)
require(`moment-duration-format`)

let { servers, Player } = require("../index");

async function play(msg, theVC) {

    let player = createAudioPlayer();

    Player[msg.guild.id] = player;

    let connection;

    connection = servers[msg.guild.id].connection == null ? await connectToChannel(theVC, msg) : servers[msg.guild.id].connection;

    connection.subscribe(player);

    servers[msg.guild.id].connection = connection;

    let resource = await getSong(servers[msg.guild.id].queue[0], msg);

    if (resource === null) {
        servers[msg.guild.id].queue.shift();
        return;
    }

    player.play(resource, { volume: 1.0 });

    player.on(AudioPlayerStatus.Idle, async () => {

        if (servers[msg.guild.id].seek === null) {
            if (servers[msg.guild.id].previous) {
                servers[msg.guild.id].queue.unshift(servers[msg.guild.id].previousQueue[0]);
                servers[msg.guild.id].previousQueue.shift();
            } else {
                if ((!servers[msg.guild.id].loop || servers[msg.guild.id].skipping) && !servers[msg.guild.id].playNow) {
                    servers[msg.guild.id].previousQueue.unshift(servers[msg.guild.id].queue[0]);
                    servers[msg.guild.id].queue.shift();
                }
            }
        }

        servers[msg.guild.id].skipping = false;
        servers[msg.guild.id].previous = false;
        servers[msg.guild.id].playNow = false;

        if (servers[msg.guild.id].queueing) {
            while (servers[msg.guild.id].queueing) {
                setTimeout(() => {
                    console.log("waiting");
                }, 100);
            }
        }

        if (servers[msg.guild.id].queue.length === 0) {

            servers[msg.guild.id].connection = null;
            connection.destroy();
            player.removeAllListeners("stateChange");
            player = null;

            return;
        } else {
            let nextSong = await getSong(servers[msg.guild.id].queue[0], msg);

            if (nextSong === null) return;

            player.play(nextSong, { volume: 1.0 });
        }
    })
}

async function connectToChannel(channel, msg) {

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: msg.guild.voiceAdapterCreator
    });

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}

async function getSong(song, msg) {
    try {
        const stream = await pdl.stream(`${song.query}`, { seek: servers[msg.guild.id].seek !== null ? servers[msg.guild.id].seek : song.seek });
        const resource = createAudioResource(stream.stream, { inputType: stream.type });

        servers[msg.guild.id].resource = resource;

        servers[msg.guild.id].seek = null;

        return resource;
    } catch (e) {
        console.log(e)
        Player[msg.guild.id].stop();
        msg.channel.send("An error occured while trying to play your song. Song possibly removed or age restricted.");

        servers[msg.guild.id].queue.shift();

        if (servers[msg.guild.id].queue.length === 0) {
            servers[msg.guild.id].connection.destroy();
            servers[msg.guild.id].connection = null;
            Player[msg.guild.id].removeAllListeners("stateChange");
            Player[msg.guild.id] = null;
            return null;
        }

        return getSong(servers[msg.guild.id].queue[0], msg);
    }
}

async function processQuery(msg, args, client, exampleMessage, billyID) {

    let query = args.slice(1).join(" ");
    let title;
    let url;
    let time;

    if (!msg.member.voice.channel) return msg.channel.send("You need to be in a voice chat in order to play music.");
    if (!query) return msg.channel.send(`You need to enter a song name, or a song URL.${exampleMessage()}`);
    let theVC = msg.member.voice.channel

    const permissions = theVC.permissionsFor(client.user);

    if (!permissions.has(`CONNECT`) || !permissions.has(`SPEAK`)) return msg.channel.send(`**I don't have permissions to either connect or speak in this voice channel.**\n\nPlease make sure I have both if you want the command to execute.${exampleMessage()}`)
    if (theVC.full) return msg.channel.send(`The current voice chat you're in is full.`)
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

    const isURL = args[1].toLowerCase().startsWith("https://") ? true : false;

    servers[msg.guild.id].queueing = true;

    try {
        if (isURL) {

            query = args[1];

            const isValid = pdl.validate(query);

            if (!isValid) return msg.channel.send(`The link you provided is not valid.${exampleMessage()}`);

            const spotifyLink = pdl.sp_validate(query);
            const youtubeLink = pdl.yt_validate(query);
            if (youtubeLink && query.startsWith("https://")) {
                if (youtubeLink === "playlist") {

                    try {
                        const playlistInfo = await pdl.playlist_info(query);

                        playlistInfo.videos.forEach((v, i) => {

                            title = v.title;
                            time = v.durationRaw;
                            url = v.url;

                            servers[msg.guild.id].queueing = false;

                            sendQuery(url, title, time, true);

                        })

                        return;
                    } catch (e) {
                        servers[msg.guild.id].queueing = false;

                        return msg.channel.send("An error occured while trying to play your playlist. Some songs are possibly removed or age restricted.");
                    }
                } else if (youtubeLink === "video") {

                    const urlInfo = await pdl.video_basic_info(query);

                    url = query;
                    title = urlInfo.video_details.title;
                    time = urlInfo.video_details.durationRaw;

                } else {
                    servers[msg.guild.id].queueing = false;

                    return msg.channel.send("An error occured while trying to play your song.");
                }
            } else if (spotifyLink && query.startsWith("https://")) {

                if (spotifyLink === "playlist" || spotifyLink === "album") {
                    getTracks(query).then(data => {
                        data.forEach(async (t, i) => {

                            const fullQuery = `${t.artists[0].name} ${t.name}`;

                            const firstVideo = await findSong(fullQuery);

                            url = firstVideo.url;
                            time = firstVideo.timestamp;
                            title = firstVideo.title;

                            servers[msg.guild.id].queueing = false;

                            sendQuery(url, title, time, true);
                        })
                    })

                    return;
                } else if (spotifyLink === "track") {
                    getData(query).then(async data => {

                        const fullQuery = `${data.artists[0].name} ${data.name}`;

                        const firstVideo = await findSong(fullQuery);

                        url = firstVideo.url;
                        time = firstVideo.timestamp;
                        title = firstVideo.title;

                        servers[msg.guild.id].queueing = false;

                        sendQuery(url, title, time, true);
                    })
                    return;
                } else {
                    servers[msg.guild.id].queueing = false;

                    return msg.channel.send("An error occured while trying to play your song.");
                }
            } else {
                servers[msg.guild.id].queueing = false;

                return msg.channel.send("An error occured while trying to play your song.");
            }
        } else {

            const firstVideo = await findSong(query);

            url = firstVideo.url;
            time = firstVideo.timestamp;
            title = firstVideo.title;
        }
    } catch (e) {
        console.log(e)
        servers[msg.guild.id].queueing = false;
        return msg.channel.send("An error occured while trying to play your song.");
    }

    servers[msg.guild.id].queueing = false;

    sendQuery(url, title, time);

    async function findSong(songName) {

        const foundVideos = await ytSearch.search(songName);

        let firstVideo;

        for (let i = 0; i < foundVideos.all.length; i++) {
            firstVideo = foundVideos.all[i];

            if (firstVideo.type === "video") break;
        }

        return firstVideo;
    }

    async function sendQuery(query, title, time, playlistSong) {
        if (servers[msg.guild.id].queue.length === 0) {
            msg.channel.send(`Now playing **${title}** - \`(${time})\``);

            servers[msg.guild.id].queue.push({ author: msg.member, query: query, title: title, time: time, seek: 0 })

            play(msg, theVC);
        } else {
            if (servers[msg.guild.id].playNow) {
                servers[msg.guild.id].queue.unshift({ author: msg.member, query: query, title: title, time: time, seek: 0 })

                if (servers[msg.guild.id].queue.length >= 2) {
                    servers[msg.guild.id].queue[1].seek = servers[msg.guild.id].resource.playbackDuration / 1000;
                }

                msg.channel.send(`Now playing **${title}** - \`(${time})\``);

                Player[msg.guild.id].stop();
            } else {
                if (!playlistSong) msg.channel.send(`Queued **${title}** - \`(${time})\``);

                servers[msg.guild.id].queue.push({ author: msg.member, query: query, title: title, time: time, seek: 0 })
            }

            servers[msg.guild.id].connection.rejoin();
        }
    }
}

module.exports = {
    name: 'play',
    description: `Plays a song.`,
    usage: "(song)",
    aliases: ["p"],
    category: `music`,
    async execute(msg, args, client, exampleMessage, billyID) {

        processQuery(msg, args, client, exampleMessage, billyID);
    },
    play,
    processQuery
}