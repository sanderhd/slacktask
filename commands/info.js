const db = require("../utils/database");

module.exports = (app) => {
    app.command("/info", async ({ command, ack, respond }) => {
        await ack();

        const taskId = command.text;
        const userId = command.user_id;

        await respond({
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: `📝 Info about task #${taskId}`,
                    },
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: db.getTaskById(taskId, userId),
                    },
                },
                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: "✅ Done"
                            },
                            style: "primary",
                            action_id: "task_done",
                        },
                    ],
                },
            ],
        });
    })
}