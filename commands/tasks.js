const db = require("../utils/database");

module.exports = (app) => {
    app.command("/list", async ({ ack, respond, user }) => {
        await ack();

        const tasks = db.getTasks(command.user_id);
        
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