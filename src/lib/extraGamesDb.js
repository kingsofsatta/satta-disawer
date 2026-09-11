import mongoose from "mongoose";
import dns from "node:dns";

const uri = process.env.SATTA_KING_FAST_MONGODB_URI;
const cacheKey = "__sattaKingFastMongoConnection";
const dnsServers = ["8.8.8.8", "1.1.1.1", "8.8.4.4"];

if (!global[cacheKey]) {
  global[cacheKey] = { connection: null, promise: null };
}

const cache = global[cacheKey];

async function connectWithDnsRetry() {
  let lastError;

  for (const server of dnsServers) {
    dns.setServers([server]);
    const connection = mongoose.createConnection(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      maxPoolSize: 10,
    });

    try {
      return await connection.asPromise();
    } catch (error) {
      lastError = error;
      await connection.close().catch(() => {});

      const isDnsError =
        error?.code === "ECONNREFUSED" ||
        error?.code === "ETIMEOUT" ||
        error?.syscall === "querySrv";
      if (!isDnsError) throw error;

      console.warn(
        `Extra-games MongoDB SRV lookup failed with DNS ${server}; retrying`,
      );
    }
  }

  throw lastError;
}

export async function connectExtraGamesDB() {
  if (!uri) {
    throw new Error("SATTA_KING_FAST_MONGODB_URI is not configured");
  }

  if (cache.connection?.readyState === 1) {
    return cache.connection;
  }

  if (!cache.promise) {
    cache.promise = connectWithDnsRetry().catch((error) => {
      cache.promise = null;
      throw error;
    });
  }

  cache.connection = await cache.promise;
  return cache.connection;
}
