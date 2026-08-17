import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { Config } from "../models/Config.js";
import { configSeed } from "./configSeed.js";

dotenv.config();

const seedConfig = async () => {
  try {
    await connectDB();

    await Config.deleteMany({});

    const config = await Config.create(configSeed);

    console.log("Configuration seeded successfully");
    console.log(`Config version: ${config.config_version}`);

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedConfig();