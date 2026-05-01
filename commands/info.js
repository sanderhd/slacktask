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
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*TaskID: ${task.id}*\n**Text:** ${task.task_text}\n**Created at:** ${task.created_at}\n**Completed:** ${task.completed ? 'Yes' : "No"}`
                }
            },
            {
                type: 'actions',
                elements: [
                    {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'Finish task'
                        },
                        action_id: 'finish_task',
                        value: task.id.toString(),
                        style: 'primary'
                    }
                ]
            }
        ];

        await respond({ blocks });
    });

    app.action('finish_task', async({ action, ack, respond }) => {
        await ack();
        const taskId = parseInt(action.value);

        db.completeTask(taskId);
        await respond('Completed task!');
    })
}