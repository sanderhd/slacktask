const express = require("express");
const api = require("./utils/api");

const app = express();
app.use(express.json());

app.get("/tasks/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const tasks = await api.getTasks(userId);

        return res.json({
            success: true,
            userId,
            tasks,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

const PORT = process.env.API_PORT || 3001;

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`)
})