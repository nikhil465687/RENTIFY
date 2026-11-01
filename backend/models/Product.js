const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{

    id: {
    type: Number,
    required: true,
    unique: true
},

imageClass: {
    type: String,
    default: ""
},
    
name: {
type: String,
required: true,
trim: true
},

    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: String,
        default: ""
    },
    emoji: {
        type: String,
        default: "📦"
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: String,
        default: "day"
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    description: {
        type: String,
        default: ""
    },
    owner: {
        type: String,
        default: "Rentify"
    },
    available: {
        type: Boolean,
        default: true
    },
    images: {
        type: [String],
        default: []
    }
},
{
    timestamps: true
}

);

module.exports = mongoose.model("Product", productSchema);