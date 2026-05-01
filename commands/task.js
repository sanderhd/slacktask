module.exports = (app) => {
    app.command("/task", async ({ command, ack, respond }) => {
        await ack;

        const task = command.text;

        await respond(`Created Task: *${task}*`)
    });
};