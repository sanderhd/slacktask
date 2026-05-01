const { app } = require("./app");

require("../commands/ping")(app);
require("../commands/task")(app);
require("../commands/tasks")(app);
