import mongoose from 'mongoose';
import User from '../db/models/User.js';

// Load env vars manually since we are not using the main entry point
// In Node 20+, we can use process.loadEnvFile() if running with --env-file or just rely on it being there?
// The user's index.js uses process.loadEnvFile(). I will assume I can run this script with node --env-file=.env server/scripts/seedAdmin.js 
// OR simpler: I'll just use dotenv logic or the same process.loadEnvFile() provided by newer Node versions if available.
// Given the user context says "The USER's OS version is mac", it might be recent. I'll stick to process.loadEnvFile() as seen in index.js.

try {
    process.loadEnvFile();
} catch (e) {
    console.log("Could not load .env file via process.loadEnvFile(), assuming variables are present or using default.");
}

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@osmiumenergy.com';
        const normalizedEmail = email.toLowerCase();
        const passwordHash = '$2b$10$XRqD17QwQgk6hAqCg9wZSO4zZHIy8mkWfvJt7XjsDTiKha7l/SjU6';

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            console.log('Admin user already exists.');
        } else {
            await User.create({
                email: normalizedEmail,
                password: passwordHash,
                created_by: `99`,
                updated_by: `99`,
            });
            console.log('Admin user created successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
