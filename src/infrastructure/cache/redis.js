const { createClient } = require("redis");
const { inspect } = require("util");

let client = null;

const getClient = async () => {
  if (client !== null) {
    return client;
  }

  try {
    client = await createClient({
      url: process.env.REDIS_URL,
    });

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
    const newClient = await createClient({
      url: process.env.REDIS_URL,
    });

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
