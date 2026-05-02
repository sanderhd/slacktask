const db = require("../utils/database");

module.exports = (app) => {
    app.command("/tasks", async ({ command, ack, respond }) => {
        await ack();

        const userId = command.user_id;
        const tasks = db.getTasks(userId);

        if (tasks.length === 0) {
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

    app.action("view_task_info", async ({ ack, action, client, body }) => {
        await ack();

        const taskId = parseInt(action.value);
        const userId = body.user.id;

        if (!taskId || isNaN(taskId)) {
            await client.chat.postEphemeral({
                channel: body.channel.id,
                user: userId,
                text: "Invalid task ID"
            });
            return;
        }

        const task = db.getTaskById(taskId, userId);

        if (!task) {
            await client.chat.postEphemeral({
                channel: body.channel.id,
                user: userId,
                text: "Task not found."
            });
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

            { type: "divider" },

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

        await client.chat.postEphemeral({
            channel: body.channel.id,
            user: userId,
            blocks
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
            text: `🗑 Task #${taskId} deleted successfully.`
        });
    });
};