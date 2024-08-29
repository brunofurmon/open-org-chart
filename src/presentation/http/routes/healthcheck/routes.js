const express = require('express');

const router = express.Router({ mergeParams: true });

function init({ cacheIsReady }) {
  router.get(
    '/liveness',
    async (_, res) => res.send({
      status: 'ok',
      data: 'Server is up and running',	
      serverDate: new Date().toISOString(),
    }),
  );
  router.get(
    '/readiness',
    async (_, res) => {

      const cacheReady = await cacheIsReady();
      if (!cacheReady) {
        res.status(500).send({
          status: 'error',
          data: 'Cache is not ready. Check connection to Redis. Or simply try again in a few seconds.',
          serverDate: new Date().toISOString(),
        });
        return;
      }
      res.send({
        status: 'ok',
        data: 'Cache is ready',
        serverDate: new Date().toISOString(),
      });
    }
  );

  return router;
}

module.exports.init = init;
