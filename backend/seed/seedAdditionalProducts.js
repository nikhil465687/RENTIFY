require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");
const products = require("./additionalProducts.json");

async function seedAdditionalProducts() {
try {
await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");
    const operations = products.map((product) => ({
        updateOne: {
            filter: { id: product.id },
            update: { $set: product },
            upsert: true
        }
    }));
    const result = await Product.bulkWrite(operations);
    const total = await Product.countDocuments();
    console.log("Products processed:", products.length);
    console.log("Inserted:", result.upsertedCount);
    console.log("Updated:", result.modifiedCount);
    console.log("Total products in database:", total);
} catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}

}

seedAdditionalProducts();