module.exports = (app) => {
    app.command("/ping", async ({ ack, respond }) => {
        await ack();
        await respond(`Pong!`)
    });
};