const { createReply, formatGist } = require('./formaters.js')
const { parseMessage, sha1 } = require('./helpers.js')
const { useGitHub } = require('./github.js')

const accessToken = process.env.GITHUB_PAT
const owner = process.env.OWNER
const branch = process.env.BRANCH
const repository = process.env.REPOSITORY
const kernelName = process.env.KERNEL_NAME
const kernelDisplayName = process.env.KERNEL_DISPLAY_NAME
const productionGistId = process.env.PROD_GIST_ID
const betaGistId = process.env.BETA_GIST_ID
const supportUrl = process.env.SUPPORT_URL

const {
    getArtifactId,
    downloadArtifact,
    createRelease,
    updateGist
} = useGitHub(accessToken, owner, repository, branch, kernelName)

exports.input = async request => {
    const { message } = JSON.parse(request.body)
    const ownerMessage = message.chat.username === owner
    const reply = createReply(message.chat.id, message.message_id, ownerMessage)
    if (!ownerMessage) {
        return reply(`🤬 Not allowed for you. Only @${owner} can do that`)
    }
    try {
        const [ version, changelog ] = parseMessage(message.text)
        const prerelease = version.includes('beta')
        const artifactId = await getArtifactId()
        const artifact = await downloadArtifact(artifactId)
        const artifactUrl = await createRelease(version, changelog, artifact, prerelease)

        const gistId = prerelease ? betaGistId : productionGistId
    
        await updateGist(gistId, formatGist(
            owner,
            gistId,
            kernelName,
            kernelDisplayName,
            version,
            artifactUrl,
            sha1(artifact),
            supportUrl,
            changelog,
            prerelease
        ))
    return reply(`🤘 Successfully created`)
    } catch (e) {
        console.error(e)
        return reply(`🔥 Could not create release`)
    }
}