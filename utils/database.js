const Database = require('better-sqlite3');
const db = new Database('tasks.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        user_id TEXT NOT NULL,
        task_text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed INTEGER DEFAULT 0
    )
`);

module.exports = {
    addTask: (userId, taskText) => {
        const stmt = db.prepare('INSERT INTO tasks (user_id, task_text) VALUES (?, ?)');

        const result = stmt.run(userId, taskText);

        return {
            id: result.lastInsertRowid,
            task_text: taskText,
            completed: 0
        };
    },

    getTasks: (userId) => {
        const stmt = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC');
        return stmt.all(userId);
    },

    getTaskById: (taskId, userId) => {
        const stmt = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?');
        return stmt.get(taskId, userId);
    },

    completeTask: (taskId) => {
        const stmt = db.prepare('UPDATE tasks SET completed = 1 WHERE id = ?');
        return stmt.run(taskId); 
    }
};