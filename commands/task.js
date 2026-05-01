module.exports = (app) => {
    app.command("/task", async ({ command, ack, respond }) => {
        await ack;

        const task = command.text;

        await respond({
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "📝 New Task Created",
                    },
                },
                {
                    type: "section",
                    text: {
                        type: "mrdown",
                        text: command.text,
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
    });
};