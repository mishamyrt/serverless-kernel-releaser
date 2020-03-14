const { createReply } = require('./formaters.js')
const { parseMessage, sha1 } = require('./helpers.js')
const { useGitHub } = require('./github.js')

const accessToken = process.env.GITHUB_PAT
const owner = process.env.OWNER
const branch = process.env.BRANCH
const repository = process.env.REPOSITORY
const kernelName = process.env.KERNEL_NAME
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
    const reply = createReply(message.chat.id, message.message_id)
    if (message.chat.username !== owner) {
        return reply(`@${message.chat.username} is torturing me`)
    }

    const [ version, changelog ] = parseMessage(message.text)
    const prerelease = version.includes('beta')
    const artifactId = await getArtifactId()
    const artifact = await downloadArtifact(artifactId)
    const artifactUrl = await createRelease(version, changelog, artficat, prerelease)

    await updateGist(prerelease ? betaGistId : productionGistId, formatGist(
        owner,
        gistId,
        kernelName,
        version,
        artifactUrl,
        sha1(artifact),
        supportUrl,
        changelog
    ))
}