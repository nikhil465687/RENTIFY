import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Sparkles,
  Send,
  ArrowLeft,
  MapPin,
  Wallet,
  Bot,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Package,
  IndianRupee,
} from "lucide-react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";


import "./LifeMode.css";

const suggestions = [
  {
    emoji: "🏠",
    title: "Furnish my new home",
    prompt:
      "I am moving into a new home. Suggest furniture and appliances.",
  },
  {
    emoji: "🎮",
    title: "Build a gaming setup",
    prompt:
      "I want to build a gaming setup with a gaming laptop, console, monitor and accessories.",
  },
  {
    emoji: "💼",
    title: "Work from home",
    prompt:
      "I need products for a comfortable work from home setup.",
  },
  {
    emoji: "🏕️",
    title: "Plan an adventure",
    prompt:
      "Suggest products for a weekend adventure or trip.",
  },
];

function LifeMode() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("Indore");

  const [submittedPrompt, setSubmittedPrompt] = useState("");

  const [recommendations, setRecommendations] = useState([]);

  const [requirements, setRequirements] = useState([]);

  const [fulfilment, setFulfilment] = useState(null);

  const [totalCost, setTotalCost] = useState(0);

  const [remainingBudget, setRemainingBudget] = useState(null);

  const [explanation, setExplanation] = useState("");

  const [provider, setProvider] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // BACKEND CONNECTION TEST
  // ==========================================

  const testBackend = async () => {
    try {
      const response = await fetch(
        "http://localhost:5050/api/health"
      );

      const data = await response.json();

      console.log("Backend response:", data);

    } catch (error) {
      console.error(
        "Backend connection failed:",
        error
      );
    }
  };

  // ==========================================
  // FIND RENTAL RECOMMENDATIONS
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!prompt.trim()) {
      setError("Please describe what you need.");
      return;
    }

    setLoading(true);
    setError("");

    setRecommendations([]);
    setRequirements([]);
    setFulfilment(null);

    setTotalCost(0);
    setRemainingBudget(null);

    setExplanation("");
    setProvider("");

    setSubmittedPrompt(prompt);

    try {
      const response = await fetch(
        "http://localhost:5050/api/ai/recommend",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
  prompt: prompt.trim(),
  budget: budget === "" ? null : Number(budget),
  location,
}),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "AI recommendation failed."
        );
      }

      // Recommendations
      setRecommendations(
        data.recommendations || []
      );

      // Requirements
      setRequirements(
        data.requirements || []
      );

      // Fulfilment summary
      setFulfilment(
        data.fulfilment || null
      );

      // Budget information
      setTotalCost(
        Number(data.totalCost || 0)
      );

      setRemainingBudget(
        data.remainingBudget ?? null
      );

      // AI explanation
      setExplanation(
        data.explanation || ""
      );

      setProvider(
        data.provider || ""
      );

      console.log("Rentify AI response:", data);

    } catch (error) {
      console.error("AI Error:", error);

      setError(
        error.message ||
        "Unable to connect to Rentify AI."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SUGGESTION HANDLER
  // ==========================================

  const handleSuggestion = (suggestion) => {
    setPrompt(suggestion);
    setError("");
  };

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  return (
    <div className="life-mode-page">

      <Navbar />

      <main className="life-mode-main">

        {/* BACK BUTTON */}

        <button
          className="life-back-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>


        {/* HERO */}

        <section className="life-ai-hero">

          <div className="life-ai-badge">
            <Sparkles size={15} />
            RENTIFY AI ASSISTANT
          </div>

          <h1>
            Your needs.
            <br />
            <span>Our intelligence.</span>
          </h1>

          <p>
            Tell us what you're planning. Rentify will help you
            discover the right rental products for your lifestyle.
          </p>

        </section>


        {/* AI CHAT WORKSPACE */}

        <section className="life-ai-workspace">

          <div className="life-ai-card">

            {/* HEADER */}

            <div className="life-ai-card-header">

              <div className="life-ai-avatar">
                <Bot size={23} />
              </div>

              <div>
                <h3>Rentify AI</h3>

                <span>
                  <span className="life-online-dot"></span>
                  Your personal rental assistant
                </span>
              </div>

              <div className="life-ai-header-badge">
                <Sparkles size={14} />
                AI ASSISTED
              </div>

            </div>


            {/* WELCOME */}

            <div className="life-ai-welcome">

              <div className="life-bot-icon">
                <Sparkles size={22} />
              </div>

              <div>
                <h3>Hey! What are you planning?</h3>

                <p>
                  Describe your requirements, your budget and
                  where you need the products. I'll help you
                  discover suitable rentals.
                </p>
              </div>

            </div>


            {/* SUGGESTIONS */}

            <div className="life-suggestions">

              <p className="life-suggestion-label">
                NEED SOME INSPIRATION?
              </p>

              <div className="life-suggestion-grid">

                {suggestions.map((item) => (

                  <button
                    key={item.title}
                    className="life-suggestion"
                    onClick={() =>
                      handleSuggestion(item.prompt)
                    }
                  >
                    <span>{item.emoji}</span>

                    <div>
                      <strong>{item.title}</strong>
                      <small>Explore rentals</small>
                    </div>

                  </button>

                ))}

              </div>

            </div>


            {/* INPUT FORM */}

            <form
              className="life-ai-form"
              onSubmit={handleSubmit}
            >

              <textarea
                placeholder="Example: I am moving into a new apartment. Help me find furniture and appliances..."
                value={prompt}
                onChange={(event) =>
                  setPrompt(event.target.value)
                }
                rows={3}
              />

              <div className="life-ai-input-bottom">

                <span>
                  <Lightbulb size={15} />
                  Be specific for better recommendations
                </span>

                <button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Thinking..." : "Find Rentals"}

                  <Send size={16} />
                </button>

              </div>

            </form>


            {/* FILTERS */}

            <div className="life-ai-filters">

              <label>
                <Wallet size={16} />
                Daily budget

                <div className="life-filter-input">

                  <span>₹</span>

                  <input
                    type="number"
                    min="1"
                    placeholder="No limit"
                    value={budget}
                    onChange={(event) =>
                      setBudget(event.target.value)
                    }
                  />

                  <span>/ day</span>

                </div>
              </label>


              <label>
                <MapPin size={16} />
                Preferred city

                <select
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                >
                  <option value="Indore">Indore</option>
                  <option value="Bhopal">Bhopal</option>
                  <option value="Ujjain">Ujjain</option>
                </select>

              </label>

            </div>


            {/* ERROR */}

            {error && (
              <p className="life-error">
                {error}
              </p>
            )}

          </div>

        </section>


        {/* LOADING */}

        {loading && (

          <div className="life-loading">

            <Sparkles size={24} />

            <h3>Finding suitable rentals...</h3>

            <p>
              Analysing your requirements and checking
              available products.
            </p>

          </div>

        )}


        {/* RESULTS */}

        {!loading && submittedPrompt && (

          <section className="life-results">

            {/* RESULTS HEADING */}

            <div className="life-results-heading">

              <div>

                <span className="life-results-label">
                  YOUR RENTAL DISCOVERY
                </span>

                <h2>Recommended for you</h2>

                <p>
                  Results for: "{submittedPrompt}"
                </p>

              </div>

              <span className="life-result-count">
                {recommendations.length} products found
              </span>

            </div>


            {/* AI EXPLANATION */}

            {explanation && (

              <div className="life-ai-explanation">

                <div className="life-explanation-icon">
                  <Sparkles size={19} />
                </div>

                <div>

                  <strong>Rentify AI Insights</strong>

                  <p>{explanation}</p>

                  {provider && (
                    <small>
                      Powered by {provider}
                    </small>
                  )}

                </div>

              </div>

            )}


            {/* REQUIREMENT FULFILMENT */}

            {fulfilment && (

              <div className="life-fulfilment-card">

                <div className="life-fulfilment-header">

                  <div>

                    <span className="life-results-label">
                      REQUIREMENT ANALYSIS
                    </span>

                    <h3>Your setup progress</h3>

                    <p>
                      Rentify checked your requested items
                      against the available catalogue.
                    </p>

                  </div>

                  <div className="life-fulfilment-percentage">
                    {fulfilment.percentage || 0}%
                  </div>

                </div>


                {/* PROGRESS BAR */}

                <div className="life-progress-track">

                  <div
                    className="life-progress-fill"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          fulfilment.percentage || 0
                        )
                      )}%`,
                    }}
                  />

                </div>


                {/* STATS */}

                <div className="life-fulfilment-stats">

                  <div className="life-fulfilment-stat fulfilled">

                    <CheckCircle2 size={19} />

                    <div>
                      <strong>
                        {fulfilment.fulfilled || 0}
                      </strong>

                      <span>Fulfilled</span>
                    </div>

                  </div>


                  <div className="life-fulfilment-stat missing">

                    <AlertCircle size={19} />

                    <div>
                      <strong>
                        {fulfilment.missing || 0}
                      </strong>

                      <span>Missing</span>
                    </div>

                  </div>


                  <div className="life-fulfilment-stat total">

                    <Package size={19} />

                    <div>
                      <strong>
                        {fulfilment.total || 0}
                      </strong>

                      <span>Total needs</span>
                    </div>

                  </div>

                </div>


                {/* REQUIREMENT LIST */}

                {requirements.length > 0 && (

                  <div className="life-requirement-list">

                    <h4>Requirement checklist</h4>

                    <div className="life-requirement-grid">

                      {requirements.map((item, index) => {

                        const isFulfilled =
                          item.status === "Fulfilled";

                        return (

                          <div
                            key={`${item.name}-${index}`}
                            className={`life-requirement-item ${
                              isFulfilled
                                ? "is-fulfilled"
                                : "is-missing"
                            }`}
                          >

                            <div className="life-requirement-icon">

                              {isFulfilled
                                ? <CheckCircle2 size={19} />
                                : <AlertCircle size={19} />
                              }

                            </div>

                            <div className="life-requirement-info">

                              <strong>{item.name}</strong>

                              <span>
                                {item.priority}
                              </span>

                              {item.matchedProducts?.length > 0 && (

                                <small>
                                  Matched:{" "}
                                  {item.matchedProducts.join(", ")}
                                </small>

                              )}

                            </div>

                            <span className="life-requirement-status">

                              {isFulfilled
                                ? "Fulfilled"
                                : "Missing"
                              }

                            </span>

                          </div>

                        );

                      })}

                    </div>

                  </div>

                )}

              </div>

            )}


            {/* BUDGET SUMMARY */}

            {budget && Number(budget) > 0 && (

              <div className="life-budget-card">

                <div className="life-budget-heading">

                  <div className="life-budget-icon">
                    <Wallet size={20} />
                  </div>

                  <div>
                    <h3>Daily rental budget</h3>
                    <p>Your combined rental cost</p>
                  </div>

                </div>


                <div className="life-budget-grid">

                  <div className="life-budget-item">

                    <span>Available budget</span>

                    <strong>
                      ₹{formatPrice(budget)}
                    </strong>

                  </div>


                  <div className="life-budget-item">

                    <span>Rental cost</span>

                    <strong>
                      ₹{formatPrice(totalCost)}
                    </strong>

                  </div>


                  <div className="life-budget-item remaining">

                    <span>Remaining budget</span>

                    <strong>
                      ₹{formatPrice(remainingBudget)}
                    </strong>

                  </div>

                </div>

                <div className="life-budget-progress">

                  <div
                    style={{
                      width: `${Math.min(
                        100,
                        (totalCost / Number(budget)) * 100
                      )}%`,
                    }}
                  />

                </div>

                <small>
                  Rental prices shown are per day.
                </small>

              </div>

            )}


            {/* PRODUCT RECOMMENDATIONS */}

            <div className="life-recommendation-heading">

              <div>
                <span className="life-results-label">
                  MATCHED RENTALS
                </span>

                <h3>Products for your needs</h3>
              </div>

              <span>
                <TrendingUp size={16} />
                AI Selected
              </span>

            </div>


            {recommendations.length > 0 ? (

              <div className="life-product-grid">

                {recommendations.map((product) => (

                  <div
                    className="life-recommended-product"
                    key={product.id}
                  >

                    <ProductCard product={product} />

                    {product.reason && (

                      <div className="life-product-reason">

                        <Sparkles size={14} />

                        <span>{product.reason}</span>

                      </div>

                    )}

                    {product.priority && (

                      <span
                        className={`life-priority-badge ${
                          product.priority.toLowerCase()
                        }`}
                      >
                        {product.priority}
                      </span>

                    )}

                  </div>

                ))}

              </div>

            ) : (

              <div className="life-empty-state">

                <span>🔍</span>

                <h3>No matching products found</h3>

                <p>
                  Try changing your budget, city or describing
                  your requirements differently.
                </p>

              </div>

            )}

          </section>

        )}


        {/* FOOTER */}

        <section className="life-ai-footer">

          <Sparkles size={20} />

          <div>

            <h3>Rent smarter. Live better.</h3>

            <p>
              Discover the freedom of renting only what you need.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default LifeMode;