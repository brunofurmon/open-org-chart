const awilix = require("awilix");

const httpServerBuilder = require("./presentation/http/server");
const loggerBuilder = require("./infrastructure/logging");
const adminDirectoryBuilder = require("./integration/googleAdminDirectoryBuilder");
const cacheBuilder = require("./infrastructure/cache");

const container = awilix.createContainer();

const cacheEngine = process.env.CACHE_ENGINE || "memory";

container.register({
  httpServer: awilix.asFunction(httpServerBuilder),
  logger: awilix.asFunction(loggerBuilder),
  adminDirectory: awilix.asFunction(adminDirectoryBuilder),
  cache: awilix.asFunction(cacheBuilder(cacheEngine)),
});

module.exports = container;
