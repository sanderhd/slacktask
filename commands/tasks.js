const db = require("../utils/database");

module.exports = (app) => {
    app.command("/tasks", async ({ command, ack, respond }) => {
        await ack();

        const userId = command.user_id;
        const tasks = db.getTasks(userId);

        if (tasks.length  === 0) {
            await respond(`No tasks found! Create a task with /task <task>`);
            return;
        }

        const blocks = [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "📋 Your Tasks",
                    emoji: true
                }
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `You have *${tasks.length}* task(s)`
                    }
                ]
            },
            {
                type: "divider"
            }
        ];

        tasks.forEach(task => {
            blocks.push(
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text:
                            `*${task.task_text}*\n` +
                            `🆔 ID: ${task.id} · 🕒 ${task.created_at}`
                    },
                    accessory: {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "View",
                            emoji: true
                        },
                        action_id: "view_task_info",
                        value: task.id.toString()
                    }
                },
                {
                    type: "divider"
                }
            );
        });

        await respond({ blocks });
    });
};