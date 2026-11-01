const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const Product = require("./models/Product");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);

// ==========================================
// 1. GEMINI CONFIGURATION
// ==========================================

if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing from .env");
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL =
    process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";


// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

// Normalize text
function normalizeText(text) {
    return String(text || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


// ==========================================
// UNIVERSAL PRODUCT MATCHING ENGINE
// ==========================================

function normalizeProductText(product) {
    return normalizeText([
        product.name,
        product.category,
        product.subcategory,
        product.description
    ].join(" "));
}


// Match MongoDB products against AI requirements
function getMatchingProducts(requirements, products) {

    if (!Array.isArray(requirements)) {
        return [];
    }

    const matchedProducts = new Map();

    requirements.forEach(requirement => {

        const requirementName = normalizeText(
            requirement.name
        );

        const words = requirementName
            .split(" ")
            .filter(word => word.length > 2);

        products.forEach(product => {

            const productText = normalizeProductText(product);

            let score = 0;

            if (productText.includes(requirementName)) {
                score += 60;
            }

            words.forEach(word => {
                if (productText.includes(word)) {
                    score += 20;
                }
            });

            if (score === 0) return;

            const id = String(product.id);

            const existing = matchedProducts.get(id);

            const match = {
                ...product,
                relevanceScore: Math.min(score, 100),
                priority: requirement.priority || "Recommended",
                reason: `Matches the requirement: ${requirement.name}`
            };

            if (
                !existing ||
                match.relevanceScore > existing.relevanceScore
            ) {
                matchedProducts.set(id, match);
            }

        });

    });

    return [...matchedProducts.values()];
}


// ==========================================
// UNIVERSAL REQUIREMENT MATCHING
// ==========================================

function getRequirementMatches(requirement, recommendations) {

    const requirementName = normalizeText(requirement.name);

    const words = requirementName
        .split(" ")
        .filter(word => word.length > 2);

    return recommendations.filter(product => {

        const productText = normalizeProductText(product);

        if (productText.includes(requirementName)) {
            return true;
        }

        const matchedWords = words.filter(word =>
            productText.includes(word)
        );

        return (
            words.length > 0 &&
            matchedWords.length >= Math.ceil(words.length * 0.5)
        );

    });
}


// ==========================================
// REQUIREMENT FULFILMENT TRACKER
// ==========================================

function calculateRequirementFulfilment(
    requirements,
    recommendations
) {

    const validRequirements = Array.isArray(requirements)
        ? requirements
        : [];

    const requirementStatus = validRequirements.map(
        requirement => {

            const matchedProducts = getRequirementMatches(
                requirement,
                recommendations
            );

            return {

                name: requirement.name,

                priority: requirement.priority,

                status: matchedProducts.length > 0
                    ? "Fulfilled"
                    : "Missing",

                matchedProducts: matchedProducts.map(
                    product => product.name
                )

            };

        }
    );

    const fulfilledCount = requirementStatus.filter(
        item => item.status === "Fulfilled"
    ).length;

    const missingCount = requirementStatus.filter(
        item => item.status === "Missing"
    ).length;

    const percentage = requirementStatus.length > 0
        ? Math.round(
            (fulfilledCount / requirementStatus.length) * 100
        )
        : 0;

    return {

        requirements: requirementStatus,

        fulfilment: {

            total: requirementStatus.length,

            fulfilled: fulfilledCount,

            missing: missingCount,

            percentage

        }

    };
}


// ==========================================
// 3. HOME ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.json({

        message: "Welcome to Rentify AI Backend!",

        status: "Server is running"

    });

});


// ==========================================
// 4. HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        message: "Rentify backend is working!"

    });

});


// ==========================================
// 5. FALLBACK REQUIREMENTS
// ==========================================

function getFallbackRequirements(prompt) {

    const query = normalizeText(prompt);

    const requirements = [];

    if (
        query.includes("gaming") ||
        query.includes("gamer")
    ) {

        requirements.push(
            {
                name: "Gaming Laptop",
                priority: "Essential"
            },
            {
                name: "Gaming Console",
                priority: "Recommended"
            },
            {
                name: "Gaming Monitor",
                priority: "Recommended"
            },
            {
                name: "Gaming Accessories",
                priority: "Recommended"
            }
        );

    }

    else if (
        query.includes("work from home") ||
        query.includes("workstation")
    ) {

        requirements.push(
            {
                name: "Laptop",
                priority: "Essential"
            },
            {
                name: "Monitor",
                priority: "Recommended"
            },
            {
                name: "Office Accessories",
                priority: "Recommended"
            }
        );

    }

    else if (
        query.includes("study") ||
        query.includes("student")
    ) {

        requirements.push(
            {
                name: "Study Table",
                priority: "Essential"
            },
            {
                name: "Study Chair",
                priority: "Recommended"
            }
        );

    }

    else if (
        query.includes("new home") ||
        query.includes("furniture") ||
        query.includes("living room")
    ) {

        requirements.push(
            {
                name: "Sofa",
                priority: "Essential"
            },
            {
                name: "Bed",
                priority: "Recommended"
            }
        );

    }

    return requirements;
}


// ==========================================
// 6. FALLBACK RECOMMENDATION ENGINE
// ==========================================

function getFallbackRecommendations(products, prompt) {

    const query = normalizeText(prompt);

    const groups = [

        {
            keywords: [
                "gaming",
                "gamer",
                "gaming room",
                "game setup"
            ],

            products: [
                "gaming laptop",
                "gaming console",
                "gaming monitor",
                "gaming chair",
                "controller",
                "keyboard",
                "mouse",
                "headphone",
                "headset"
            ]
        },

        {
            keywords: [
                "work from home",
                "office",
                "workstation"
            ],

            products: [
                "laptop",
                "monitor",
                "office chair",
                "desk",
                "keyboard",
                "printer"
            ]
        },

        {
            keywords: [
                "study",
                "student",
                "studying"
            ],

            products: [
                "study table",
                "study chair",
                "laptop",
                "desk lamp",
                "monitor"
            ]
        },

        {
            keywords: [
                "new home",
                "furnish",
                "furniture",
                "living room"
            ],

            products: [
                "sofa",
                "bed",
                "table",
                "chair",
                "wardrobe",
                "refrigerator",
                "washing machine"
            ]
        },

        {
            keywords: [
                "adventure",
                "camping",
                "trekking"
            ],

            products: [
                "tent",
                "bicycle",
                "bike",
                "camping gear",
                "backpack"
            ]
        },

        {
            keywords: [
                "appliance",
                "appliances",
                "kitchen",
                "cooking"
            ],

            products: [
                "microwave",
                "refrigerator",
                "washing machine",
                "mixer",
                "air fryer"
            ]
        }

    ];

    const matchedGroup = groups.find(group =>
        group.keywords.some(keyword =>
            query.includes(keyword)
        )
    );

    if (!matchedGroup) {
        return [];
    }

    return products

        .map(product => {

            const name = normalizeText(product.name);

            const description = normalizeText(
                product.description
            );

            let score = 0;

            matchedGroup.products.forEach(keyword => {

                if (name.includes(keyword)) {

                    score += 10;

                }

                else if (description.includes(keyword)) {

                    score += 3;

                }

            });

            return {
                product,
                score
            };

        })

        .filter(item => item.score >= 10)

        .sort((a, b) => b.score - a.score)

        .slice(0, 8)

        .map(item => ({

            ...item.product,

            relevanceScore: Math.min(
                100,
                item.score * 10
            ),

            priority: item.score >= 20
                ? "Essential"
                : "Recommended",

            reason:
                "Matched your requirements using Rentify's fallback recommendation engine."

        }))

        
}


// ==========================================
// 7. OPTIMAL PRODUCT COMBINATION ENGINE
// ==========================================

function optimizeProductCombination(products, budget) {

    const dailyBudget = Number(budget);

    // Remove invalid products and duplicate IDs

    const uniqueProducts = [

        ...new Map(

            products

                .filter(product =>
                    Number.isFinite(Number(product.price)) &&
                    Number(product.price) >= 0
                )

                .map(product => [
                    String(product.id),
                    product
                ])

        ).values()

    ].slice(0, 15);


    // No budget limit

    if (
        budget === undefined ||
        budget === null ||
        budget === "" ||
        !Number.isFinite(dailyBudget) ||
        dailyBudget <= 0
    ) {

        const selected = uniqueProducts.slice(0, 8);

        return {

            products: selected,

            totalCost: selected.reduce(
                (sum, product) =>
                    sum + Number(product.price),
                0
            )

        };

    }


    let bestCombination = [];

    let bestScore = -1;

    let bestCost = 0;


    // Priority-based scoring

    function calculateScore(combination) {

        return combination.reduce((score, product) => {

            const priorityWeights = {

                Essential: 10000,

                Recommended: 1000,

                Optional: 100

            };

            const priorityScore =
                priorityWeights[product.priority] || 0;

            const relevanceScore =
                Number(product.relevanceScore || 0);

            return score +
                priorityScore +
                relevanceScore;

        }, 0);

    }


    // Backtracking optimization

    function search(index, combination, totalCost) {

        if (totalCost > dailyBudget) {
            return;
        }

        const score = calculateScore(combination);

        if (
            score > bestScore ||
            (
                score === bestScore &&
                totalCost < bestCost
            )
        ) {

            bestScore = score;

            bestCombination = [...combination];

            bestCost = totalCost;

        }


        if (
            index >= uniqueProducts.length ||
            combination.length >= 8
        ) {

            return;

        }


        const product = uniqueProducts[index];

        const price = Number(product.price);


        // Include product

        if (totalCost + price <= dailyBudget) {

            combination.push(product);

            search(
                index + 1,
                combination,
                totalCost + price
            );

            combination.pop();

        }


        // Exclude product

        search(
            index + 1,
            combination,
            totalCost
        );

    }


    search(0, [], 0);


    return {

        products: bestCombination,

        totalCost: bestCost

    };

}


// ==========================================
// 8. GEMINI AI RECOMMENDATION ROUTE
// ==========================================

app.post("/api/ai/recommend", async (req, res) => {

    const {
        prompt,
        budget,
        location
    } = req.body;

    try {

        // Validate prompt

        if (
            !prompt ||
            typeof prompt !== "string" ||
            !prompt.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please describe your rental requirements."

            });

        }



       

        // Validate budget

        if (
            budget !== undefined &&
            budget !== null &&
            budget !== "" &&
            (
                !Number.isFinite(Number(budget)) ||
                Number(budget) < 0
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid daily budget."

            });

        }


        // ----------------------------------
        // FILTER AVAILABLE PRODUCTS
        // ----------------------------------

        // ----------------------------------
// FETCH PRODUCTS FROM MONGODB
// ----------------------------------

const allProducts = await Product.find({
    available: true
}).lean();

console.log(
    "Total MongoDB products:",
    allProducts.length
);


// ----------------------------------
// FILTER AVAILABLE PRODUCTS
// ----------------------------------

const availableProducts = allProducts.filter(product => {

    const matchesLocation =
        !location ||
        normalizeText(product.location) ===
        normalizeText(location);

    const matchesBudget =
        !budget ||
        Number(budget) <= 0 ||
        Number(product.price) <= Number(budget);

    return matchesLocation && matchesBudget;

});

console.log(
    "Filtered products:",
    availableProducts.length
);

        if (availableProducts.length === 0) {

            return res.json({

                success: true,

                explanation:
                    "No products match your selected city and budget. Try changing your preferences.",

                requirements: [],

                fulfilment: {
                    total: 0,
                    fulfilled: 0,
                    missing: 0,
                    percentage: 0
                },

                recommendations: [],

                totalCost: 0

            });

        }

    
        // ----------------------------------
        // PREPARE GEMINI CATALOGUE
        // ----------------------------------

        const catalogue = availableProducts.map(product => ({

            id: product.id,

            name: product.name,

            category: product.category,

            subcategory: product.subcategory || "",

            price: product.price,

            location: product.location,

            description: product.description || ""

        }));
    

        try {

            console.log("Sending request to Gemini...");

            console.log("Model:", MODEL);


            // ----------------------------------
            // GEMINI API REQUEST
            // ----------------------------------

            let timeoutId;

            const response = await Promise.race([

                ai.models.generateContent({

                    model: MODEL,

                    contents: `

You are Rentify AI, an intelligent rental recommendation assistant.

CUSTOMER REQUIREMENTS:

${prompt}

PREFERRED LOCATION:

${location || "Any"}

TOTAL DAILY RENTAL BUDGET:

${budget || "No limit"}

AVAILABLE PRODUCT CATALOGUE:

${JSON.stringify(catalogue)}


TASK:

PART 1: REQUIREMENTS

PART 1: UNDERSTAND CUSTOMER REQUIREMENTS

1. Understand the complete real-life situation described by the customer.
2. Identify every individual rental item needed.
3. Separate essential items from recommended and optional items.
4. Consider the customer's purpose, activity and context.
5. Do not invent products that are unrelated to the user's situation.
6. Use the actual product categories available in the catalogue.
7. Do not restrict recommendations to any particular category.
8. Convert broad requirements into individual products whenever possible.

IMPORTANT:

If the user asks for a gaming setup, identify individual items
such as gaming laptop, monitor, keyboard and mouse.

If the user asks for a new home, identify individual items
such as sofa, bed, refrigerator and washing machine.

If the user asks for a party, identify suitable items
such as speakers, projector and furniture.

Always adapt requirements to the user's actual request.

PART 2: PRODUCT RECOMMENDATIONS

Analyse every product in the available catalogue.

For each relevant product:

1. Assign a relevance score from 0 to 100.
2. Identify its priority:
   Essential, Recommended or Optional.
3. Explain which customer requirement it fulfils.


SCORING:

90-100: Directly required by the customer.
70-89: Strongly useful.
40-69: Helpful additional item.
0-39: Not sufficiently relevant.


IMPORTANT RULES:

1. Recommend only products from the supplied catalogue.
2. Never invent product IDs.
3. Do not recommend unrelated products.
4. Respect the selected location.
5. Respect the total daily rental budget.
6. Prioritize essential products.
7. Analyse all products.
8. Do not recommend duplicate products.
9. Do not recommend chairs unless the customer requests them.
10. A broad requirement such as Gaming Accessories may match multiple products.
11. Requirements must be individual rental items, not vague
    umbrella groups such as "Accessories" or "Equipment".

Return JSON in this exact structure:

{
    "requirements": [
        {
            "name": "Gaming Laptop",
            "priority": "Essential"
        },
        {
            "name": "Gaming Accessories",
            "priority": "Recommended"
        }
    ],
    "products": [
        {
            "id": 1,
            "relevanceScore": 95,
            "priority": "Essential",
            "reason": "Directly matches the customer's requirement."
        }
    ],
    "explanation": "Explain why these products are suitable."
}

                    `,

                    config: {

                        responseMimeType: "application/json",

                        responseSchema: {

                            type: "OBJECT",

                            properties: {

                                requirements: {

                                    type: "ARRAY",

                                    items: {

                                        type: "OBJECT",

                                        properties: {

                                            name: {
                                                type: "STRING"
                                            },

                                            priority: {

                                                type: "STRING",

                                                enum: [
                                                    "Essential",
                                                    "Recommended",
                                                    "Optional"
                                                ]

                                            }

                                        },

                                        required: [
                                            "name",
                                            "priority"
                                        ]

                                    }

                                },


                                products: {

                                    type: "ARRAY",

                                    items: {

                                        type: "OBJECT",

                                        properties: {

                                            id: {
                                                type: "INTEGER"
                                            },

                                            relevanceScore: {
                                                type: "INTEGER"
                                            },

                                            priority: {

                                                type: "STRING",

                                                enum: [
                                                    "Essential",
                                                    "Recommended",
                                                    "Optional"
                                                ]

                                            },

                                            reason: {
                                                type: "STRING"
                                            }

                                        },

                                        required: [
                                            "id",
                                            "relevanceScore",
                                            "priority",
                                            "reason"
                                        ]

                                    }

                                },


                                explanation: {
                                    type: "STRING"
                                }

                            },

                            required: [
                                "requirements",
                                "products",
                                "explanation"
                            ]

                        }

                    }

                }),


                new Promise((_, reject) => {

                    timeoutId = setTimeout(() => {

                        reject(
                            new Error(
                                "Gemini request timed out"
                            )
                        );

                    }, 15000);

                })

            ]).finally(() => clearTimeout(timeoutId));


            // ----------------------------------
            // PARSE GEMINI RESPONSE
            // ----------------------------------

            const aiResult = JSON.parse(response.text);


            console.log(
                "Gemini AI successfully generated recommendations!"
            );

            console.log(
                "Gemini explanation:",
                aiResult.explanation
            );


            // ----------------------------------
            // VALIDATE PRODUCT IDS
            // ----------------------------------

            const validProducts = new Map(

                availableProducts.map(product => [

                    String(product.id),

                    product

                ])

            );


            // ----------------------------------
            // SCORE GEMINI PRODUCTS
            // ----------------------------------

            const scoredProducts = (

                Array.isArray(aiResult.products)
                    ? aiResult.products
                    : []

            )

                .filter(item =>

                    item &&

                    validProducts.has(String(item.id)) &&

                    Number.isFinite(
                        Number(item.relevanceScore)
                    )

                )

                .map(item => ({

                    ...validProducts.get(String(item.id)),

                    relevanceScore: Math.max(

                        0,

                        Math.min(
                            100,
                            Number(item.relevanceScore)
                        )

                    ),

                    priority: item.priority,

                    reason: item.reason

                }))

                .sort((a, b) =>
                    b.relevanceScore - a.relevanceScore
                );

                // ----------------------------------
// ADD DIRECT CATALOGUE MATCHES
// ----------------------------------

const catalogueMatches = getMatchingProducts(
    aiResult.requirements,
    availableProducts
);

const combinedProducts = new Map();

[...scoredProducts, ...catalogueMatches].forEach(product => {

    const id = String(product.id);

    if (!combinedProducts.has(id)) {

        combinedProducts.set(id, product);

    } else {

        const existing = combinedProducts.get(id);

        if (
            product.relevanceScore >
            existing.relevanceScore
        ) {
            combinedProducts.set(id, product);
        }

    }

});

const finalScoredProducts = [...combinedProducts.values()]
    .sort((a, b) =>
        b.relevanceScore - a.relevanceScore
    );


            // ----------------------------------
            // OPTIMIZE PRODUCT COMBINATION
            // ----------------------------------

           const optimized = optimizeProductCombination(
    finalScoredProducts,
    budget
);

            const recommendations = optimized.products;

            const totalCost = optimized.totalCost;


            // ----------------------------------
            // REQUIREMENT FULFILMENT TRACKER
            // ----------------------------------

            const fulfilmentData =
                calculateRequirementFulfilment(

                    aiResult.requirements,

                    recommendations

                );


            console.log("Gemini recommendations:");

            recommendations.forEach(product => {

                console.log(

                    product.name,

                    "Score:", product.relevanceScore,

                    "Priority:", product.priority

                );

            });


            console.log(
                "Optimized daily cost:",
                totalCost
            );

            console.log(
                "Requirement fulfilment:",
                fulfilmentData.fulfilment
            );


            // ----------------------------------
            // SEND FINAL RESPONSE
            // ----------------------------------

            return res.json({

                success: true,

                provider: "Google Gemini",

                explanation:
                    aiResult.explanation ||
                    "Here are your optimized rental recommendations.",

                requirements:
                    fulfilmentData.requirements,

                fulfilment:
                    fulfilmentData.fulfilment,

                recommendations,

                totalCost,

                dailyBudget: Number(budget) || null,

                remainingBudget:

                    Number(budget) > 0

                        ? Number(budget) - totalCost

                        : null

            });


        } catch (aiError) {

            // ----------------------------------
            // GEMINI FAILURE
            // ----------------------------------

            console.error(

                "Gemini unavailable:",

                aiError.message

            );


            console.log(
                "Switching to fallback engine..."
            );


            // ----------------------------------
            // FALLBACK RECOMMENDATIONS
            // ----------------------------------

            const fallbackProducts =
                getFallbackRecommendations(

                    availableProducts,

                    prompt

                );


            // Optimize fallback products

            const optimized = optimizeProductCombination(

                fallbackProducts,

                budget

            );

            const recommendations = optimized.products;

            const totalCost = optimized.totalCost;


            // ----------------------------------
            // FALLBACK REQUIREMENT TRACKING
            // ----------------------------------

            const fallbackRequirements =
                getFallbackRequirements(prompt);

            const fulfilmentData =
                calculateRequirementFulfilment(

                    fallbackRequirements,

                    recommendations

                );


            // ----------------------------------
            // FALLBACK RESPONSE
            // ----------------------------------

            return res.json({

                success: true,

                provider: "Rentify Fallback",

                explanation:
                    "Gemini is temporarily unavailable. Here are suitable rentals from Rentify's recommendation engine.",

                requirements:
                    fulfilmentData.requirements,

                fulfilment:
                    fulfilmentData.fulfilment,

                recommendations,

                totalCost,

                dailyBudget: Number(budget) || null,

                remainingBudget:

                    Number(budget) > 0

                        ? Number(budget) - totalCost

                        : null

            });

        }

    } catch (error) {

        console.error(

            "Recommendation Error:",

            error

        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to generate recommendations."

        });

    }

});


// ==========================================
// 9. GEMINI API TEST ROUTE
// ==========================================

app.get("/api/ai/test", async (req, res) => {

    try {

        const response = await ai.models.generateContent({

            model: MODEL,

            contents:
                "Reply with exactly: Gemini is working!"

        });


        return res.json({

            success: true,

            provider: "Google Gemini",

            model: MODEL,

            response: response.text

        });

    } catch (error) {

        console.error(

            "Gemini test failed:",

            error.message

        );


        return res.status(500).json({

            success: false,

            provider: "Google Gemini",

            error: error.message

        });

    }

});


// ==========================================
// 10. START SERVER
// ==========================================

// ==========================================
// 10. CONNECT DATABASE AND START SERVER
// ==========================================

const PORT = process.env.PORT || 5050;

const startServer = async () => {

    try {

        // Connect MongoDB first
        await connectDB();

        // Start Express server after successful connection
        app.listen(PORT, () => {

            console.log("--------------------------------");

            console.log(
                `Rentify backend running on http://localhost:${PORT}`
            );

            console.log(
                `AI Provider: Google Gemini (${MODEL})`
            );

            console.log("Database: MongoDB Connected");

            console.log("--------------------------------");

        });

    } catch (error) {

        console.error("Failed to start Rentify:", error.message);

        process.exit(1);

    }

};

startServer();