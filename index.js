require("dotenv").config();
const { App} = require("@slack/bolt");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SIGNING_SECRET
});

app.command("/ping", async ({ command, ack, respond }) => {
    await ack();

    await respond("Pong!");
});

(async () => {
    await app.start(3001)
    console.log("SlackTask is running on :3001");
})