const db = require("../utils/database");

module.exports = (app) => {
    app.command("/task", async ({ command, ack, respond }) => {
        await ack();

        const taskText = command.text;
        const userId = command.user_id;

        if (!taskText) {
            await respond("Use: /task <task>");
            return;
        }

        const task = db.addTask(userId, task)

        await respond({
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "📝 Task Created",
                        emoji: true
                    },
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*${task.task_text}*`,
                    },
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: `🆔 ID: ${task.id} · 👤 <@${userId}>`
                        }
                    ]
                },
                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: "✅ Mark as done",
                                emoji: true
                            },
                            style: "primary",
                            action_id: "task_done",
                            value: task.id.toString()
                        },
                    ],
                },
            ],
        });
    });

    app.action("task_done", async ({ ack, body, client, action }) => {
        await ack();

        const taskId = parseInt(action.value);

        db.completeTask(taskId);

        await client.chat.postEphemeral({
            channel: body.channel.id,
            user: body.user.id,
            text: `✅ Task ${taskId} completed!`
        })
    })
};