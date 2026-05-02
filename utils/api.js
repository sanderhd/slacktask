const db = require("./database");

module.exports = {
    getTasks(userId) {
        return db.getTasks(userId);
    }
};