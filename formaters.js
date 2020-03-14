const gistUrl = 'https://gist.githubusercontent.com'

const getDate = () => new Date().toISOString().substring(0, 10)

const getTimestamp = () => new Date().getTime()

const getChangelogUrl = (owner, gistId) =>
    `${gistUrl}/${owner}/${gistId}/raw/changelog.md?${getTimestamp()}`

const createReply = (chat_id, message_id, ownerMessage) =>
    message => ({
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            method: 'sendMessage',
            chat_id: chat_id, 
            reply_to_message_id : ownerMessage ? message_id : null, 
            text : `${message}`
        }),
        isBase64Encoded: false
    })

const formatGist = (owner, gistId, kernelName, kernelDisplayName, version, fileUrl, fileSHA1, supportUrl, changelog, prerelease) => {
    return {
        'fkm.json': {
            content: JSON.stringify({
                kernel: {
                    name: `${kernelDisplayName} ${prerelease ? ' Beta' : ''}`,
                    date: getDate(),
                    changelog_url: getChangelogUrl(owner, gistId),
                    link: fileUrl,
                    sha1: fileSHA1,
                    version,
                },
                support: {
                    link: supportUrl
                }
            }),
            filename: `${kernelName}.json`
        },
        'changelog.md': {
            content: `**${version}**\n\n${changelog}`,
            filename: 'changelog.md'
        }
    }
}

module.exports = {
    createReply,
    formatGist
}