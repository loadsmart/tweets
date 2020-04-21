const core = require("@actions/core");
const github = require("@actions/github");

const { IncomingWebhook } = require("@slack/webhook");

const buildNotification = ({ text, pr }) => ({
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
          text: `*Date:* ${pr.created_at}`,
        },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "```We’ve been using @DangerSystems for almost 2ys at @LoadsmartUS. It started tiny and now more and more projects have it integrated. It’s not only improving our projects’ overall quality but also helping us building our culture. If you don’t know it yet, @_camila_maia_ made this 🚀```",
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

try {
  const text = core.getInput("text");
  const url = process.env.SLACK_WEBHOOK_URL;
  const webhook = new IncomingWebhook(url);

  console.info("Sending notification to Slack...");

  const args = {
    text: text,
    pr: github.context.payload.pull_request,
  };
  const notification = buildNotification(args);
  console.info("Notification args:", notification);

  (async () => {
    await webhook.send(notification);
    console.info("Notification sent!");
  })();
} catch (error) {
  console.info("Error sending notification:");
  core.setFailed(error.message);
}
