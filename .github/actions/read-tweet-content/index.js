const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/action");

async function run() {
  try {
    const octokit = new Octokit();
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    const pull_number = github.context.payload.pull_request.number;

    const { files } = await octokit.request(
      "GET /repos/:owner/:repo/pulls/:pull_number/files",
      {
        owner,
        repo,
        pull_number,
      }
    );

    console.log("files", files);
    core.setFailed("on purpose");
    return;

    // TODO read from file in the PR
    const content = "This is supposed to be the content of the tweet";

    core.setOutput("content", content);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
