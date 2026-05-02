const db = require("../utils/database");

module.exports = (app) => {
    app.command("/info", async ({ command, ack, respond }) => {
        await ack();

        const userId = command.user_id;
        const args = command.text.trim().split(' ');
        const taskId = parseInt(args[0]);

        if (!taskId || isNaN(taskId)) {
            await respond('Use: /info <task_id>');
            return;
        }

        const task = db.getTaskById(taskId, userId);
        if (!task) {
            await respond('Task not found.');
            return;
        }

        const blocks = [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: `📋 Task #${task.id}`,
                    emoji: true
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text:
                        `*Task:* ${task.task_text}\n` +
                        `*Created:* ${task.created_at}\n` +
                        `*Completed:* ${task.completed ? "✅ Yes" : "❌ No"}`
                }
            },
            {
                type: "divider"
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `User: <@${userId}> · Task ID: ${task.id}`
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
                            text: "✔ Finish task",
                            emoji: true
                        },
                        style: "primary",
                        action_id: "finish_task",
                        value: task.id.toString()
                    },
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "🗑 Delete",
                            emoji: true
                        },
                        style: "danger",
                        action_id: "delete_task",
                        value: task.id.toString(),
                        confirm: {
                            title: {
                                type: "plain_text",
                                text: "Are you sure?"
                            },
                            text: {
                                type: "mrkdwn",
                                text: "This task will be permanently deleted."
                            },
                            confirm: {
                                type: "plain_text",
                                text: "Delete"
                            },
                            deny: {
                                type: "plain_text",
                                text: "Cancel"
                            }
                        }
                    }
                ]
            }
        ];

        await respond({ blocks });
    });

    app.action('finish_task', async ({ action, ack, client, body }) => {
        await ack();

        const taskId = parseInt(action.value);
        const userId = body.user.id;

        if (!taskId || isNaN(taskId)) return;

        db.completeTask(taskId);

        await client.chat.postEphemeral({
            channel: body.channel.id,
            user: userId,
            text: `✅ Task ${taskId} completed!`
        });
    });

    app.action("delete_task", async ({ ack, action, body, client }) => {
        await ack();

        const taskId = parseInt(action.value);
        const userId = body.user.id;

        if (!taskId || isNaN(taskId)) return;

        const task = db.getTaskById(taskId, userId);

        if (!task) {
            await client.chat.postEphemeral({
                channel: body.channel.id,
                user: userId,
                text: "Task not found."
            });
            return;
        }

        db.deleteTask(taskId, userId);

        await client.chat.postEphemeral({
            channel: body.channel.id,
            user: userId,
            text: `🗑 Task ${taskId} deleted successfully.`
        });
    });
};