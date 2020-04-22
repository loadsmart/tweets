const core = require("@actions/core");
const github = require("@actions/github");

const { IncomingWebhook } = require("@slack/webhook");

const buildNotification = ({ text, tweet, pr }) => ({
  blocks: [
    {
      type: "section",
      text: {
        type: "plain_text",
        emoji: true,
        text: text,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: "*Platform:* Twitter :bird:",
        },
        {
          type: "mrkdwn",
          text: `*Date:* ${pr.created_at.split("T")[0]}`,
        },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "```" + tweet + "```",
      },
    },
    {
      type: "divider",
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `*PR:* ${pr.html_url}`,
        },
      ],
    },
  ],
});

async function run() {
  try {
    const tweet = core.getInput("tweet");
    if (tweet === "" || tweet === undefined || tweet === null) {
      console.info("No tweets found in this PR. Skipping.");
      return;
    }

    const text = core.getInput("text");
    const url = process.env.SLACK_WEBHOOK_URL;
    const webhook = new IncomingWebhook(url);

    console.info("Sending notification to Slack...");

    const args = {
      text: text,
      tweet: tweet,
      pr: github.context.payload.pull_request,
    };
    const notification = buildNotification(args);
    console.info(
      "Notification args:",
      JSON.stringify(notification, undefined, 2)
    );

    await webhook.send(notification);
    console.info("Notification sent!");
  } catch (error) {
    console.info("Error sending notification:");
    core.setFailed(error.message);
  }
}

run();
