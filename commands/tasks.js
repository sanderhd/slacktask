const db = require("../utils/database");

module.exports = (app) => {
    app.command("/list", async ({ command, ack, respond }) => {
        await ack();

        const userId = command.user_id;
        const tasks = db.getTasks(userId);
        
        const taskBlocks = tasks.map(task => ({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `${task.completed ? "✅" : "❌"} ${task.task_text}`
            }
        }));

        await respond({
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "📋 Your Tasks"
                    }
                },
                ...taskBlocks
            ]
        });
    });
};