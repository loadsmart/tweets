const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/action");

async function run() {
  try {
    const octokit = new Octokit();
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    const pull_number = github.context.payload.pull_request.number;

    octokit.request();
    const { data } = await octokit.request(
      "GET /repos/:owner/:repo/pulls/:pull_number/files",
      {
        owner,
        repo,
        pull_number,
      }
    );

    const tweetFiles = data.filter((file) => file.filename.endsWith(".tweet"));

    if (tweetFiles.length === 0) {
      console.info("No tweets found. Skipping.");
      core.setOutput("");
      return;
    }

    if (tweetFiles.length > 1) {
      core.setFailed("You're supposed to send only 1 tweet per pull request.");
      return;
    }

    const content = await octokit.request(tweetFiles[0].raw_url);
    console.log("content", content);
    core.setFailed("on purpose");

    // const content = "This is supposed to be the content of the tweet";

    // core.setOutput("content", content);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
