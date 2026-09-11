import mongoose from "mongoose";
import dns from "node:dns";

const mongoUri = process.env.MONGODB_URI;
const dnsServers = ["8.8.8.8", "1.1.1.1", "8.8.4.4"];
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectWithDnsRetry(options) {
  let lastError;

  for (const server of dnsServers) {
    dns.setServers([server]);

    try {
      const connection = await mongoose.connect(mongoUri, options);
      console.log("MongoDB connected successfully");
      return connection;
    } catch (error) {
      lastError = error;
      await mongoose.disconnect().catch(() => {});

      const isDnsError =
        error?.code === "ECONNREFUSED" ||
        error?.code === "ETIMEOUT" ||
        error?.syscall === "querySrv";
      if (!isDnsError) throw error;

      console.warn(`MongoDB SRV lookup failed with DNS ${server}; retrying`);
    }
  }

  console.error("MongoDB connection error:", lastError?.message);
  throw lastError;
}

export async function connectDB() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = connectWithDnsRetry({
      bufferCommands: false,
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      maxPoolSize: 10,
      minPoolSize: 0,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
