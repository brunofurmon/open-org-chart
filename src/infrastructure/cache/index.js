const cacheEngines = ["memory", "redis"];

const init = (cacheEngine) => () => {
  if (!cacheEngines.includes(cacheEngine)) {
    throw new Error(
      `Cache engine ${cacheEngine} not supported. Supported cache engines: ${cacheEngines.join(
        ", "
      )}`
    );
  }

  // Dynamic import
  const cache = require(`./${cacheEngine}`);

  const get = (key) => {
    const namespacedKey = `${process.env.npm_package_name}:${key}`;
    return cache.get(namespacedKey)
  };

  const set = (key, value, ttl) => {
    const namespacedKey = `${process.env.npm_package_name}:${key}`;
    return cache.set(namespacedKey, value, ttl)
  };

  const cachedResult = async (cb, cacheKey, ttl) => {
    const cachedResult = await get(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const result = await cb();

    await set(cacheKey, result, ttl);

    return result;
  };

  const isReady = async () => {
    return await cache.isReady();
  };

  return { get, set, cachedResult, isReady };
};

export default init;
