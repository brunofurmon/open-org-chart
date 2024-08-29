const container = require('../container');

const logger = container.resolve('logger');

let server;
const gracefulShutdown = async () => {
  logger.info('Received kill signal, shutting down gracefully');
  await server.close();
};

(async () => {
  const httpServerBuilder = container.resolve('httpServer');
  const httpServer = await httpServerBuilder.nextWrappedHttpServer();

  server = httpServer.listen(process.env.SERVER_PORT, () => {
    logger.info(`Server is running on port ${process.env.SERVER_PORT}`);
  });
})();

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
