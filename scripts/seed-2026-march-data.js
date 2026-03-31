// Seed script for March 2026 data
// Run with: node scripts/seed-2026-march-data.js

require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.szokn.mongodb.net/goodluck?appName=Cluster0";

const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    game: { type: String, required: true },
    date: { type: String, required: true },
    resultNumber: { type: String, required: true },
    waitingGame: { type: String, required: true },
}, { timestamps: true });

const Result = mongoose.model('Result', ResultSchema);

// March 2026 data from the website
// Format: [day, disawer, shirdi-dham, kaliyar, delhi-bazar, shri-ganesh, faridabad, shakti-peeth, gaziyabad, mathura, gali]
const march2026Data = [
    [1, '--', '65', '90', '35', '36', '02', '20', '10', '11', '92'],
    [2, '68', '38', '13', '06', '00', '91', '63', '10', '84', '30'],
    [3, '49', '31', '52', '92', '17', '06', '67', '13', '43', '17'],
    [4, '19', '40', '75', '39', '74', '66', '56', '65', '29', '90'],
    [5, '54', '31', '16', '70', '14', '07', '63', '46', '93', '74'],
    [6, '36', '85', '36', '29', '59', '36', '30', '02', '79', '45'],
    [7, '38', '26', '14', '21', '57', '62', '05', '60', '80', '22'],
    [8, '45', '77', '03', '97', '98', '29', '72', '78', '50', '51'],
    [9, '65', '95', '45', '81', '94', '46', '45', '26', '60', '99'],
    [10, '49', '64', '31', '71', '79', '79', '70', '74', '54', '64'],
    [11, '09', '39', '92', '18', '76', '28', '68', '58', '43', '24'],
    [12, '25', '52', '57', '91', '15', '90', '60', '18', '87', '09'],
    [13, '03', '44', '32', '95', '36', '49', '75', '72', '30', '20'],
    [14, '95', '07', '70', '22', '16', '82', '58', '75', '55', '74'],
    [15, '39', '17', '68', '00', '48', '39', '48', '27', '31', '82'],
    [16, '28', '19', '00', '58', '61', '68', '12', '12', '32', '17'],
    [17, '47', '26', '87', '11', '45', '58', '41', '26', '36', '45'],
    [18, '82', '85', '25', '66', '33', '90', '82', '76', '31', '76'],
    [19, '50', '03', '26', '22', '33', '87', '08', '26', '46', '43'],
    [20, '12', '27', '13', '56', '07', '74', '63', '23', '90', '85'],
    [21, '16', '42', '82', '20', '26', '49', '24', '17', '64', '01'],
    [22, '70', '52', '61', '61', '34', '40', '29', '28', '73', '70'],
    [23, '27', '07', '76', '88', '71', '59', '01', '10', '45', '86'],
    [24, '66', '87', '52', '01', '02', '28', '12', '75', '34', '82'],
    [25, '13', '04', '80', '55', '90', '48', '37', '70', '29', '30'],
    [26, '92', '01', '58', '75', '42', '43', '81', '34', '17', '68'],
    [27, '26', '35', '65', '74', '16', '82', '82', '43', '90', '83'],
    [28, '40', '28', '82', '91', '05', '35', '60', '05', '76', '26'],
    [29, '93', '93', '31', '58', '00', '00', '02', '14', '52', '21'],
    [30, '23', '32', '29', '56', '14', '84', '24', '20', '51', '39'],
    [31, '81', '--', '--', '--', '--', '--', '--', '--', '--', '--'],
];

// Game configurations with their waiting game mappings
const gameConfigs = [
    { game: 'disawer', index: 1, waitingGame: 'shirdi-dham' },
    { game: 'shirdi-dham', index: 2, waitingGame: 'kaliyar' },
    { game: 'kaliyar', index: 3, waitingGame: 'delhi-bazar' },
    { game: 'delhi-bazar', index: 4, waitingGame: 'shri-ganesh' },
    { game: 'shri-ganesh', index: 5, waitingGame: 'faridabad' },
    { game: 'faridabad', index: 6, waitingGame: 'shakti-peeth' },
    { game: 'shakti-peeth', index: 7, waitingGame: 'gaziyabad' },
    { game: 'gaziyabad', index: 8, waitingGame: 'mathura' },
    { game: 'mathura', index: 9, waitingGame: 'gali' },
    { game: 'gali', index: 10, waitingGame: 'disawer' },
];

async function seedMarch2026Data() {
    try {
        console.log('Connecting to:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Verify connection by counting existing results
        const existingCount = await Result.countDocuments({});
        console.log('Existing results in DB:', existingCount);

        let totalInserted = 0;

        for (const gameConfig of gameConfigs) {
            const { game, index, waitingGame } = gameConfig;
            const results = [];

            for (const row of march2026Data) {
                const day = row[0];
                const resultNumber = row[index];

                if (resultNumber !== '--' && resultNumber !== undefined) {
                    const dayStr = day.toString().padStart(2, '0');
                    const date = `2026-03-${dayStr}`;

                    results.push({
                        game,
                        date,
                        resultNumber,
                        waitingGame,
                    });
                }
            }

            // Use insertMany with ordered: false to skip duplicates
            try {
                const inserted = await Result.insertMany(results, { ordered: false });
                console.log(`${game}: Inserted ${inserted.length} results for March 2026`);
                totalInserted += inserted.length;
            } catch (err) {
                if (err.code === 11000) {
                    console.log(`${game}: Some duplicates skipped`);
                    totalInserted += err.insertedDocs?.length || 0;
                } else {
                    throw err;
                }
            }
        }

        console.log(`\nTotal: Inserted ${totalInserted} results for March 2026`);

        // Verify insertion
        const finalCount = await Result.countDocuments({});
        console.log('Total results in DB after seeding:', finalCount);

        const results2026 = await Result.countDocuments({
            date: { $gte: "2026-01-01", $lte: "2026-12-31" }
        });
        console.log('2026 results count:', results2026);

        console.log('March 2026 seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding March 2026 data:', error);
        process.exit(1);
    }
}

seedMarch2026Data();