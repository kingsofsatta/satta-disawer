import mongoose from "mongoose";
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Read URI and sanitize common formatting mistakes (quotes, trailing semicolons, extra spaces)
let mongoUri = process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.szokn.mongodb.net/goodluck?appName=Cluster0";
if (typeof mongoUri === 'string') {
    mongoUri = mongoUri.trim();
    // Strip enclosing quotes if present and remove a trailing semicolon
    mongoUri = mongoUri.replace(/^\s*["']+|["';\s]+$/g, '');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose
            .connect(mongoUri, opts)
            .then((mongoose) => {
                return mongoose;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}
