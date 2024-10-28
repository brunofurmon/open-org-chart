const { createClient } = require("redis");
const { inspect } = require("util");

let client = null;
let clientConfig = {
  url: process.env.REDIS_URL,
  socket: {
    connectTimeout: process.env.REDIS_CONN_TIMEOUT_MS
  }
}

const getClient = async () => {
  if (client !== null) {
    return client;
  }

  try {
    client = await createClient(clientConfig);

    await client.connect();
  } catch (error) {
    throw new Error(`Redis Client Error: ${inspect(error)}`);
  }

  return client;
};

const get = async (key) => {
  const client = await getClient();
  const value = await client.get(key);
  return JSON.parse(value);
};

const set = async (key, value, ttl) => {
  const client = await getClient();
  await client.set(key, JSON.stringify(value));
  await client.expire(key, ttl);
};

const isReady = async () => {
  try {
    const newClient = await createClient(clientConfig);

    await newClient.connect();
    await newClient.disconnect();
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  get,
  set,
  isReady,
};
