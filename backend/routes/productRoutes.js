const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

// Validate numeric product ID
const getNumericId = (id) => {
const numericId = Number(id);

if (!Number.isSafeInteger(numericId) || numericId <= 0) {
    return null;
}
return numericId;

};

// =====================================
// GET ALL PRODUCTS
// =====================================

router.get("/", async (req, res) => {
try {
const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error: error.message
    });
}

});

// =====================================
// GET SINGLE PRODUCT BY NUMERIC ID
// =====================================

router.get("/:id", async (req, res) => {
try {
const id = getNumericId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            success: false,
            message: "Invalid numeric product ID"
        });
    }
    const product = await Product.findOne({ id });
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
    res.status(200).json({
        success: true,
        product
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: "Failed to fetch product",
        error: error.message
    });
}

});

// =====================================
// ADD PRODUCT
// =====================================

router.post("/", async (req, res) => {
try {
const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        message: "Product added successfully",
        product
    });
} catch (error) {
    res.status(400).json({
        success: false,
        message: "Failed to add product",
        error: error.message
    });
}

});

// =====================================
// UPDATE PRODUCT BY NUMERIC ID
// =====================================

router.put("/:id", async (req, res) => {
try {
const id = getNumericId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            success: false,
            message: "Invalid numeric product ID"
        });
    }
    const updates = { ...req.body };
    // Do not allow changing the product's numeric ID
    delete updates.id;
    delete updates._id;
    const product = await Product.findOneAndUpdate(
        { id },
        { $set: updates },
        {
            new: true,
            runValidators: true
        }
    );
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product
    });
} catch (error) {
    res.status(400).json({
        success: false,
        message: "Failed to update product",
        error: error.message
    });
}

});

// =====================================
// DELETE PRODUCT BY NUMERIC ID
// =====================================

router.delete("/:id", async (req, res) => {
try {
const id = getNumericId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            success: false,
            message: "Invalid numeric product ID"
        });
    }
    const product = await Product.findOneAndDelete({ id });
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: "Failed to delete product",
        error: error.message
    });
}

});

module.exports = router;