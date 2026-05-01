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
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'Here are your tasks:'
                }
            }
        ];
        
        tasks.forEach(task => {
            blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*ID: ${task.id}* - ${task.task_text} (Created at: ${task.created_at})`
                },
                accesory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Info'
                    },
                    action_id: 'view_task_info',
                    value: task.id.toString()
                }
            });
        });

        await respond({ blocks });
    });
};