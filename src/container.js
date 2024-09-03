const awilix = require("awilix");

const httpServerBuilder = require("./presentation/http/server");
const loggerBuilder = require("./infrastructure/logging");
const adminDirectoryBuilder = require("./integration/googleAdminDirectoryBuilder");
const cacheBuilder = require("./infrastructure/cache");
const csvBuilder = require("./integration/csv");

const container = awilix.createContainer();
const cacheEngine = process.env.CACHE_ENGINE || "memory";
const userBackendMode = process.env.USER_BACKEND_MODE || "csv";

container.register({
  httpServer: awilix.asFunction(httpServerBuilder),
  logger: awilix.asFunction(loggerBuilder),
  usersStore: awilix.asFunction(
    userBackendMode === 'csv' ? csvBuilder : adminDirectoryBuilder),
  cache: awilix.asFunction(cacheBuilder(cacheEngine)),
});

module.exports = container;
