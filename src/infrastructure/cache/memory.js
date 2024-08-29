const localCache = {};

// Keeping await keyword for the sake of interfacing with real cache engines

const get = async (key) => {
  const value = localCache[key];
  if (!value) {
    return null;
  }
  return JSON.parse(value);
};

const set = async (key, value) => {
  localCache[key] = JSON.stringify(value);
};

const isReady = async () => true;

module.exports = {
  get,
  set,
  isReady
};
