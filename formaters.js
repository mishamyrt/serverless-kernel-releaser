const gistUrl = 'https://gist.githubusercontent.com'

const getDate = () => new Date().toISOString().substring(0, 10)

const getTimestamp = () => new Date().getTime()

const capitalize = str =>
    str.toUpperCase() + str.slice(1)

const getChangelogUrl = (owner, gistId) =>
    `${gistUrl}/${owner}/${gistId}/raw/changelog.md?${getTimestamp()}`

const createReply = (chat_id, message_id) =>
    message => ({
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            method: 'sendMessage',
            chat_id: chat_id, 
            reply_to_message_id : message_id, 
            text : `${message}`
        },
        isBase64Encoded: false
    })

const formatGist = (owner, gistId, kernelName, version, fileUrl, fileSHA1, supportUrl, changelog) => {
    const files = {
        'fkm.json': {
            content: {
                kernel: {
                    name: `${capitalize(kernelName)} ${!isRelease ? ' Beta' : ''}`,
                    date: getDate(),
                    changelog_url: getChangelogUrl(owner, gistId),
                    link: fileUrl,
                    sha1: fileSHA1,
                    version,
                },
                support: {
                    link: supportUrl
                }
            },
            filename: `${kernelName}.json`
        },
        'changelog.md': {
            content: `**${version}**\n\n${changelog}`,
            filename: 'changelog.md'
        }
    }
    return { files }
}

module.exports = {
    createReply,
    formatGist
}