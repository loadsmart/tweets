const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/action");

async function run() {
  try {
    const octokit = new Octokit();
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    const pull_number = github.context.payload.pull_request.number;

    const filesResponse = await octokit.request(
      "GET /repos/:owner/:repo/pulls/:pull_number/files",
      {
        owner,
        repo,
        pull_number,
      }
    );

    const tweetFiles = filesResponse.data.filter((file) =>
      file.filename.endsWith(".tweet")
    );

    if (tweetFiles.length === 0) {
      console.info("No tweets found. Skipping.");
      core.setOutput("content", "");
      return;
    }

    if (tweetFiles.length > 1) {
      core.setFailed("You're supposed to send only 1 tweet per pull request.");
      return;
    }

    const tweetFileResponse = await octokit.request(tweetFiles[0].raw_url);
    const content = tweetFileResponse.data.replace("\\n", "");

    console.info("Tweet found:", content);
    core.setOutput("content", content);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
