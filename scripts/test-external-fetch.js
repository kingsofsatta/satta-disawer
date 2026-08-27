#!/usr/bin/env node

/**
 * Test Script for External Games Fetch
 * 
 * This script tests:
 * 1. MongoDB connection
 * 2. Fetching games from a7satta.com
 * 3. Saving to database
 * 
 * Usage: node scripts/test-external-fetch.js
 */

import mongoose from 'mongoose';
import * as cheerio from 'cheerio';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

// Load environment variables
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.szokn.mongodb.net/goodluck?appName=Cluster0";
const SOURCE_URL = "https://a7satta.com/";


// Test 1: MongoDB Connection
async function testMongoDBConnection() {
    console.log("📡 Test 1: Testing MongoDB Connection...");
    console.log(`   URI: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
    
    try {
        await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000, // 10 second timeout
        });
        
        console.log("✅ MongoDB Connected Successfully!\n");
        return true;
    } catch (error) {
        console.error("❌ MongoDB Connection Failed!");
        console.error(`   Error: ${error.message}`);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.error("\n💡 Solution:");
            console.error("   1. Check MongoDB Atlas Network Access");
            console.error("   2. Whitelist your IP address or allow 0.0.0.0/0");
            console.error("   3. Verify database credentials");
        }
        
        console.error("\n");
        return false;
    }
}

// Test 2: Fetch from a7satta.com
async function testFetchExternalSite() {
    console.log("🌐 Test 2: Fetching from a7satta.com...");
    
    try {
        const response = await fetch(SOURCE_URL, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();

        if (/Attention Required|Just a moment|Cloudflare/i.test(html)) {
            throw new Error("Cloudflare challenge detected");
        }

        const $ = cheerio.load(html);
        const parsedGames = [];

        // Parse the main results table
        $("table tr").each((_, row) => {
            const cells = $(row).find("td");
            if (cells.length < 2) return;

            const firstCell = $(cells[0]).text().trim();
            const match = firstCell.match(/^(.+?)\s+(\d{1,2}:\d{2}\s*(?:AM|PM))$/i);
            
            if (match) {
                const gameName = match[1].trim();
                const gameTime = match[2].trim();
                const yesterdayResult = $(cells[1]).text().trim();
                const todayResult = cells.length > 2 ? $(cells[2]).text().trim() : "--";

                parsedGames.push({
                    name: gameName,
                    time: gameTime,
                    yesterdayResult,
                    todayResult: todayResult || "--"
                });
            }
        });

        console.log(`✅ Successfully fetched ${parsedGames.length} games from a7satta.com`);
        console.log("\n📋 Games Found:");
        parsedGames.forEach((game, i) => {
            console.log(`   ${i + 1}. ${game.name} (${game.time})`);
            console.log(`      Today: ${game.todayResult}, Yesterday: ${game.yesterdayResult}`);
        });
        console.log();

        return parsedGames;
    } catch (error) {
        console.error("❌ Failed to fetch from a7satta.com");
        console.error(`   Error: ${error.message}\n`);
        return [];
    }
}

// Test 3: Save to Database
async function testSaveToDatabase(games) {
    if (games.length === 0) {
        console.log("⚠️  No games to save to database\n");
        return false;
    }

    console.log("💾 Test 3: Saving to MongoDB...");

    try {
        // Define schema inline for testing
        const externalGameSchema = new mongoose.Schema({
            name: { type: String, required: true },
            time: { type: String, required: true },
            todayResult: { type: String, default: "--" },
            yesterdayResult: { type: String, default: "--" },
            source: { type: String, default: "a7satta" },
            fetchedAt: { type: Date, default: Date.now },
        }, { timestamps: true });

        externalGameSchema.index({ name: 1, time: 1 }, { unique: true });

        const ExternalGame = mongoose.models.ExternalGame || 
                            mongoose.model('ExternalGame', externalGameSchema);

        // Save first game as test
        const testGame = games[0];
        await ExternalGame.updateOne(
            { name: testGame.name, time: testGame.time },
            {
                $set: {
                    todayResult: testGame.todayResult,
                    yesterdayResult: testGame.yesterdayResult,
                    fetchedAt: new Date(),
                },
                $setOnInsert: { source: "a7satta" },
            },
            { upsert: true }
        );

        console.log(`✅ Successfully saved test game to database`);
        console.log(`   Game: ${testGame.name} (${testGame.time})`);
        console.log();

        // Get count of all external games
        const count = await ExternalGame.countDocuments();
        console.log(`📊 Total External Games in Database: ${count}\n`);

        return true;
    } catch (error) {
        console.error("❌ Failed to save to database");
        console.error(`   Error: ${error.message}\n`);
        return false;
    }
}

// Main Test Runner
async function runTests() {
    let exitCode = 0;

    // Test 1: MongoDB Connection
    const mongoConnected = await testMongoDBConnection();
    if (!mongoConnected) {
        exitCode = 1;
        await mongoose.disconnect();
        process.exit(exitCode);
    }

    // Test 2: Fetch External Site
    const games = await testFetchExternalSite();
    if (games.length === 0) {
        exitCode = 1;
    }

    // Test 3: Save to Database
    if (mongoConnected && games.length > 0) {
        const saved = await testSaveToDatabase(games);
        if (!saved) {
            exitCode = 1;
        }
    }

    // Cleanup
    await mongoose.disconnect();

    // Summary
    console.log("═══════════════════════════════════════");
    if (exitCode === 0) {
        console.log("✅ ALL TESTS PASSED!");
        console.log("\n🎉 Your setup is working correctly.");
        console.log("Results should now update automatically from a7satta.com");
    } else {
        console.log("❌ SOME TESTS FAILED");
        console.log("\n📖 Check SETUP_GUIDE.md for solutions");
    }
    console.log("═══════════════════════════════════════\n");

    process.exit(exitCode);
}

// Run tests
runTests().catch((error) => {
    console.error("💥 Unexpected Error:", error);
    process.exit(1);
});
