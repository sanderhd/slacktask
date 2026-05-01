module.exports = (app) => {
    app.command("/ping", async ({ ack, respond }) => {
        await ack();

        const start = Date.now();

        const result = await respond("Pinging...");
        
        const latency = Date.now() - start;

        await respond({
            text: `Pong! \n Latency: \`${latency}ms\``
        });
    });
};