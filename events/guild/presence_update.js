const Discord = require(`discord.js`)


module.exports = (billyID, client, prefix, oldPresence, newPresence) => {

    const memberTag = newPresence.user.tag
    const oldStatus = oldPresence === undefined ? `offline` : oldPresence.status
    const newStatus = newPresence.status
    
    if (oldStatus === newStatus) return;

    const statusChannel = client.channels.cache.get(`782129379496034314`)

    statusChannel.send(`${memberTag} status changed. Old: ${oldStatus}. New: ${newStatus}`)

}