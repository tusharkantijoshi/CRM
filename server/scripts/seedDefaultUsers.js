import mongoose from "mongoose";
import User from "../db/models/User.js";

try {
  process.loadEnvFile();
} catch {
  console.log(
    "Could not load .env file via process.loadEnvFile(), assuming variables are present or using default.",
  );
}

const seedDefaultUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Same password hash for both users (Admin@123)
    const passwordHash =
      "$2b$10$XRqD17QwQgk6hAqCg9wZSO4zZHIy8mkWfvJt7XjsDTiKha7l/SjU6";

    // Admin user
    const adminEmail = "admin@osmiumenergy.com";
    const normalizedAdminEmail = adminEmail.toLowerCase();

    const existingAdmin = await User.findOne({ email: normalizedAdminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists.");
    } else {
      await User.create({
        email: normalizedAdminEmail,
        password: passwordHash,
        role: "admin",
        created_by: `99`,
        modified_by: `99`,
      });
      console.log("Admin user created successfully.");
    }

    // Regular user
    const userEmail = "user@osmiumenergy.com";
    const normalizedUserEmail = userEmail.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedUserEmail });

    if (existingUser) {
      console.log("Regular user already exists.");
    } else {
      await User.create({
        email: normalizedUserEmail,
        password: passwordHash,
        role: "user",
        created_by: `99`,
        modified_by: `99`,
      });
      console.log("Regular user created successfully.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding default users:", error);
    process.exit(1);
  }
};

seedDefaultUsers();
