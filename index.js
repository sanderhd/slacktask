require("dotenv").config();
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SIGNING_SECRET
});

app.command("/ping", async ({ command, ack, respond }) => {
  await ack();
  await respond(`Pong`);
});

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log(`Bot is running on ${process.env.PORT || 3000}!`);
  } catch (err) {
    console.error("START ERROR:", err);
  }
})();