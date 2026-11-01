require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");
const products = require("./products.json");

const seedProducts = async () => {
try {
if (!process.env.MONGODB_URI) {
throw new Error("MONGODB_URI is missing from backend/.env");
}

    await mongoose.connect(process.env.MONGODB_URI);
    const operations = products.map((product) => ({
        updateOne: {
            filter: { id: product.id },
            update: { $set: product },
            upsert: true
        }
    }));
    const result = await Product.bulkWrite(operations);
    console.log("Product seeding completed.");
    console.log(`Products in source file: ${products.length}`);
    console.log(`Inserted: ${result.upsertedCount}`);
    console.log(`Updated: ${result.modifiedCount}`);
    console.log(`Matched without changes: ${result.matchedCount}`);
    console.log("Existing products not in the source file were left untouched.");
} catch (error) {
    console.error("Product seeding failed:", error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}

};

seedProducts();