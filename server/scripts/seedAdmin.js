import mongoose from 'mongoose';
import User from '../db/models/User.js';

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
                modified_by: `99`,
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
