const Discord = require(`discord.js`)
const moment = require(`moment`)
require(`moment-duration-format`)

module.exports = {
    pages: function (arr, itemsperpage, page = 1) {
        const maxpages = Math.ceil(arr.length / itemsperpage)
        if (page < 1 || page > maxpages) return null;
        return arr.slice((page - 1) * itemsperpage, page * itemsperpage)
    },
    createTimeStamp: function( seconds ) {

        let time;

        if (seconds < 60000) {
            time = moment.duration(seconds).format(`[0:]ss`);
        } else if (seconds < 3600000) {
            time = moment.duration(seconds).format(`mm:ss`);
        } else {
            time = moment.duration(seconds).format(`hh:mm:ss`);
        }

        return time;
    },
    arrayshuffle: function (arr) {
        let newpos, selectpos;

        for (let i = arr.length - 1; i > 0; i--) {
            newpos = Math.floor(Math.random() * (i + 1));
            selectpos = arr[i]
            arr[i] = arr[newpos]
            arr[newpos] = selectpos
        }
        return arr;
    },
    cooldownTime: function (theCommand, client, msg) {

        const cooldownAmount = client.commands.get(theCommand).cd || 1500
        const timestamp = client.cooldowns.get(theCommand)
        const now = Date.now()
        const expirationTime = (timestamp.get(msg.author.id) + cooldownAmount) - now

        if (expirationTime < 1000) {
            timeLeft = moment.duration(expirationTime).format(`0.SS [seconds]`)
        } else if (expirationTime < 60000) {
            timeLeft = moment.duration(expirationTime).format(`ss.SS [seconds]`)
        } else if (expirationTime < 3600000) {
            timeLeft = moment.duration(expirationTime).format(`mm [minutes], [and] ss.SS [seconds]`)
        } else {
            timeLeft = moment.duration(expirationTime).format(`hh [hours], mm [minutes], [and] ss.SS [seconds]`)
        }

        const splitTime = timeLeft.split(` `)

        const newTimeLeft = splitTime.map(t => t.startsWith(0) ? t.replace(0, ``) : t).join(` `)

        return newTimeLeft
    }
}