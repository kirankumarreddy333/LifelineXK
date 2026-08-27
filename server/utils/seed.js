// Seed script: npm run seed
// Seeds achievements + hospitals into the database

const mongoose = require("mongoose");
require("dotenv").config();

const Achievement = require("../models/Achievement");
const Hospital = require("../models/Hospital");
const { achievements, hospitals } = require("../data/seedData");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");

    await Achievement.deleteMany();
    await Achievement.insertMany(achievements);
    console.log(`✅ Seeded ${achievements.length} achievements`);

    await Hospital.deleteMany();
    await Hospital.insertMany(hospitals);
    console.log(`✅ Seeded ${hospitals.length} hospitals`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();

