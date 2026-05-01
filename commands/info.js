const db = require("../utils/database");

module.exports = (app) => {
    app.command("/info", async ({ command, ack, respond }) => {
        await ack();

        const userId = command.user_id
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
                        }
                    ]
                }
            ];

        await respond({ blocks });
    });

    app.action('finish_task', async({ action, ack, client, body }) => {
        await ack();
        console.log(`[LOG] Button clicked`)
        const taskId = parseInt(action.value);
        db.completeTask(taskId);

        await client.chat.postEphemeral({
            channel: body.channel.id,
            user: body.user.id,
            text: `✅ Task ${taskId} completed!`
        })
    })
}