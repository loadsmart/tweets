const core = require("@actions/core");

try {
  // TODO read from file in the PR
  const content = "This is supposed to be the content of the tweet";

  core.setOutput("content", content);
} catch (error) {
  core.setFailed(error.message);
}
