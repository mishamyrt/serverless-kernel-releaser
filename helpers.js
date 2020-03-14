const crypto = require('crypto')

const parseMessage = message => {
    const lines = message.split('\n')
    const version = lines[0].trim()
    lines.shift()
    return [version, lines.join('\n').trim()]
}

const sha1 = (bytes) => crypto
    .createHash('sha1')
    .update(new Buffer.from(bytes))
    .digest('hex')

module.exports = {
    parseMessage,
    sha1
}