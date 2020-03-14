const { Octokit } = require("@octokit/rest");

const useGitHub = (accessToken, owner, repo, branch, kernelName) => {
    const github = new Octokit({
        auth: accessToken
    });
    return {
        getArtifactId: async () => {
            const [branchData, runs] = await Promise.all([
                github.repos.getBranch({ owner, repo, branch }),
                github.actions.listRepoWorkflowRuns({ owner, repo })
            ])
            const commitSha = branchData.data.commit.sha
            return runs.data.workflow_runs.filter(run => run.head_sha === commitSha)[0].id
        },

        downloadArtifact: async artifactId => {
            const artifactResponce = await github.actions.downloadArtifact({
                owner,
                repo,
                artifact_id: artifactId,
                archive_format: 'zip'
            })
            return artifactResponce.data
        },

        updateGist: (id, content) => github.gists.update(id, content),

        createRelease: async (version, changelog, artficat, prerelease) => {
            const release = await github.octokit.repos.createRelease({
                owner, repo,
                tag_name: `v${version}`,
                name: version,
                target_commitish: branch,
                body: changelog,
                prerelease
            })
            const releaseAsset = await uploadReleaseAsset({
                owner, repo,
                release_id: release.data.id,
                url: release.data.upload_url,
                name: `${kernelName}-${version}.zip`,
                headers: {
                    'content-length': artficat.byteLength,
                    'content-type': 'application/zip',
                },
                data
            })
            return releaseAsset.data.browser_download_url
        }
    }
}

module.exports = { useGitHub }