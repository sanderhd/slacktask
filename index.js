require("dotenv").config();
const { app } = require("./slack/app");
require("./slack/registerCommands");

const logger = require("./utils/logger");

(async () => {
  await app.start(process.env.PORT || 3000);
  logger.log(`Bot is running on ${process.env.PORT || 3000}`);
})();