module.exports = (app) => {
    app.command("/ping", async ({ ack, respond }) => {
        const start = Date.now();
        await ack();

        const latency = Date.now() - start;

        await respond({
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "🏓 Pong!",
                        emoji: true
                    }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*Latency:* \`${latency}ms\``
                    }
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: 'mrkdwn',
                            text: "SlackTask is online and responsive ✅"
                        }
                    ]
                }
            ]
        });
    });
};