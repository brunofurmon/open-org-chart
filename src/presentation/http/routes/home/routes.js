const express = require("express");
const router = express.Router({ mergeParams: true });
const userServiceBuilder = require("../../../../domain/user/service");

function init({ cache, usersStore }, renderFunction) {
  router.get(
    "/",
    // Data fetching
    async (req, res, next) => {
      const debugMode = req.query.debug === "true";

      const fetchUsers = () =>
        cache.cachedResult(
          usersStore.listUsers,
          "users",
          parseInt(process.env.ADMIN_USERS_TTL_CACHE_S, 10) || 300
        );

      const userService = userServiceBuilder({ fetchUsers });
      const users = await userService.listUsers(debugMode);

      res.locals.users = users;

      next();
    },
    // page rendering
    async (req, res) => renderFunction(req, res)
  );

  return router;
}

module.exports.init = init;
