import { useState } from "react";
import { useProducts } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Sofa,
  Laptop,
  CarFront,
  Refrigerator,
  Dumbbell,
  Wrench,
  BedDouble,
  Tv,
  WashingMachine,
  Snowflake,
  Armchair,
  Table2,
  BookOpen,
  Baby,
  PawPrint,
  ShieldCheck,
  CircleCheck,
  Star,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const categories = [
  {
    name: "Furniture",
    emoji: "🛋️",
    icon: Sofa,
    color: "peach",
    description: "Sofas, chairs & tables",
  },
  {
    name: "Electronics",
    emoji: "💻",
    icon: Laptop,
    color: "blue",
    description: "Laptops & gadgets",
  },
  {
    name: "Vehicles",
    emoji: "🚲",
    icon: CarFront,
    color: "green",
    description: "Bikes & vehicles",
  },
  {
    name: "Appliances",
    emoji: "🧊",
    icon: Refrigerator,
    color: "lavender",
    description: "Home essentials",
  },
  {
    name: "Sports",
    emoji: "⚽",
    icon: Dumbbell,
    color: "yellow",
    description: "Gear up & play",
  },
  {
    name: "Tools",
    emoji: "🛠️",
    icon: Wrench,
    color: "gray",
    description: "Tools for every job",
  },
  {
    name: "Beds",
    emoji: "🛏️",
    icon: BedDouble,
    color: "peach",
    description: "Sleep comfortably",
  },
  {
    name: "Televisions",
    emoji: "📺",
    icon: Tv,
    color: "blue",
    description: "Big-screen moments",
  },
  {
    name: "Washing Machines",
    emoji: "🧺",
    icon: WashingMachine,
    color: "green",
    description: "Laundry made easy",
  },
  {
    name: "Air Conditioners",
    emoji: "❄️",
    icon: Snowflake,
    color: "lavender",
    description: "Stay cool",
  },
  {
    name: "Office Chairs",
    emoji: "💺",
    icon: Armchair,
    color: "yellow",
    description: "Work in comfort",
  },
  {
    name: "Study Tables",
    emoji: "🪑",
    icon: Table2,
    color: "gray",
    description: "A space to focus",
  },
  {
    name: "Bookshelves",
    emoji: "📚",
    icon: BookOpen,
    color: "peach",
    description: "Store and display",
  },
  {
    name: "Baby & Kids",
    emoji: "🧸",
    icon: Baby,
    color: "blue",
    description: "Little-life essentials",
  },
  {
    name: "Pet Products",
    emoji: "🐾",
    icon: PawPrint,
    color: "green",
    description: "Comfort for companions",
  },
];

const extraCategories = [
  { name: "TV Units", emoji: "🗄️" },
  { name: "Air Coolers", emoji: "🌬️" },
  { name: "Power Tools", emoji: "🪛" },
  { name: "Kitchen Appliances", emoji: "🍳" },
  { name: "Dining Sets", emoji: "🍽️" },
  { name: "Fitness Gear", emoji: "🏋️" },
  { name: "Outdoor Gear", emoji: "🏕️" },
  { name: "Projectors", emoji: "📽️" },
  { name: "Cameras", emoji: "📷" },
  { name: "Travel Gear", emoji: "🧳" },
  { name: "Musical Instruments", emoji: "🎸" },
  { name: "Gaming", emoji: "🎮" },
];

const lifeModes = [
  {
    title: "Moving into a new home",
    description:
      "Set up your space with furniture and appliances without buying everything.",
    emoji: "🏠",
  },
  {
    title: "Planning a weekend trip",
    description:
      "Rent bikes, outdoor gear and travel essentials for your next adventure.",
    emoji: "🏕️",
  },
  {
    title: "Building a workspace",
    description:
      "Get the desk, chair and tech you need to focus and do your best work.",
    emoji: "💼",
  },
];

const reviews = [
  {
    name: "Aarav S.",
    text: "Found what I needed for my temporary setup without spending on things I would only use for a few months.",
  },
  {
    name: "Meera K.",
    text: "The idea of renting across different categories in one place makes short-term needs much easier.",
  },
  {
    name: "Rohan P.",
    text: "A simple way to get the gear I need for a project and return it when I am done.",
  },
];

const imageUrl = (id, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

function Home() {

  const { products, loading, error } = useProducts();
  
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const navigate = useNavigate();

  const categoryNames = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {
  const term = search.trim().toLowerCase();

  // Show only available products
  const isAvailable = product.available !== false;

  // Match the selected category
  const matchesCategory =
    selectedCategory === "All" ||
    product.category?.toLowerCase() ===
      selectedCategory.toLowerCase() ||
    product.subcategory?.toLowerCase() ===
      selectedCategory.toLowerCase();

  // Match the search input
  const matchesSearch =
    !term ||
    product.name?.toLowerCase().includes(term) ||
    product.category?.toLowerCase().includes(term) ||
    product.subcategory?.toLowerCase().includes(term) ||
    product.description?.toLowerCase().includes(term);

  return isAvailable && matchesCategory && matchesSearch;
});

  const scrollToRentals = () => {
    document
      .getElementById("popular-rentals")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const chooseCategory = (name) => {
  navigate(`/category/${encodeURIComponent(name)}`);
};

  return (
    <div className="home">
      {/* NAVBAR: SEARCH BAR IS INSIDE THE TOP NAVIGATION */}
      <Navbar search={search} setSearch={setSearch} />

      <main>
        {/* TOP CATEGORIES AND PROMOTIONAL HERO */}
        <section className="marketplace-section">
          <div className="marketplace-layout">
            <article className="marketplace-hero">
              <div className="hero-red-shape"></div>

              <div
                className="hero-photo"
                role="img"
                aria-label="Modern living room"
                style={{
                  backgroundImage: `url("${imageUrl(
                    "photo-1600210492486-724fe5c67fb0"
                  )}")`,
                }}
              ></div>

              <div className="hero-photo-overlay"></div>

              <div className="hero-content">
                <span className="marketplace-badge">
                  THE SMARTER WAY TO LIVE
                </span>

                <h1>
                  Make room
                  <br />
                  for <span>more.</span>
                </h1>

                <p>
                  Rent the things you need, for as long as you need
                  them. Less buying, more living.
                </p>

                <button
                  className="marketplace-hero-button"
                  onClick={scrollToRentals}
                >
                  Explore rentals <ArrowUpRight size={18} />
                </button>
              </div>

              <div className="hero-image-caption">
                <span>RENTIFY PICKS</span>
                <strong>Good things, on your terms.</strong>
                <ArrowUpRight size={19} />
              </div>
            </article>

            <section
              className="marketplace-categories"
              aria-labelledby="top-categories-title"
            >
              <div className="section-heading">
                <div>
                  <h2 id="top-categories-title">
                    Explore <span>top categories</span>
                  </h2>

                  <p>
                    Find the right thing for whatever life has planned.
                  </p>
                </div>

                <button
                  className="round-arrow"
                  aria-label="View more categories"
                  onClick={() =>
                    document
                      .getElementById("more-categories")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <ArrowRight size={19} />
                </button>
              </div>

              <div className="category-grid top-category-grid">
                {categories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <button
                      className={`category-card category-${category.color}`}
                      key={category.name}
                      onClick={() => chooseCategory(category.name)}
                    >
                      <span className="category-emoji">
                        {category.emoji}
                      </span>

                      <span className="category-name">
                        {category.name}
                      </span>

                      <span className="category-description">
                        {category.description}
                      </span>

                      <Icon
                        className="category-card-icon"
                        size={15}
                      />
                    </button>
                  );
                })}
              </div>

              <button
                className="view-more-link"
                onClick={() =>
                  setShowAllCategories((value) => !value)
                }
              >
                {showAllCategories
                  ? "Show fewer categories"
                  : "View more categories"}

                <ArrowRight size={15} />
              </button>

              {showAllCategories && (
                <div className="extra-category-row">
                  {extraCategories.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => chooseCategory(item.name)}
                    >
                      <span>{item.emoji}</span>
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>

        {/* MORE CATEGORIES */}
        <section
          className="more-categories-section"
          id="more-categories"
        >
          <div className="more-categories-content">
            <div className="section-heading">
              <div>
                <h2>
                  More <span>categories</span>
                </h2>

                <p>
                  Little things that make a big difference.
                </p>
              </div>
            </div>

            <div className="more-category-grid">
              {extraCategories.slice(0, 10).map((item) => (
                <button
                  key={item.name}
                  className="more-category-card"
                  onClick={() => chooseCategory(item.name)}
                >
                  <span>{item.emoji}</span>
                  <strong>{item.name}</strong>
                </button>
              ))}
            </div>
          </div>

          <button
            className="category-promo"
            onClick={scrollToRentals}
          >
            <img
              src={imageUrl("photo-1600585154340-be6161a56a0c")}
              alt="Bright, thoughtfully furnished home"
            />

            <span className="promo-shade"></span>

            <span className="promo-copy">
              <small>MAKE YOUR SPACE YOURS</small>

              <strong>
                Big comfort.
                <br />
                Flexible plans.
              </strong>

              <span>
                Explore home essentials <ArrowUpRight size={17} />
              </span>
            </span>
          </button>
        </section>

        {/* LATEST AND TRENDING RENTALS */}
        <section
          className="popular-rentals"
          id="popular-rentals"
        >
          <div className="popular-heading">
            <div>
              <span className="section-label">
                FIND YOUR NEXT FAVOURITE
              </span>

              <h2>
  {selectedCategory === "All" ? (
    <>
      Latest <span>& trending</span>
    </>
  ) : (
    <>
      <span>{selectedCategory}</span> for rent
    </>
  )}
</h2>

              <p>
                Useful finds for everyday life, projects and adventures.
              </p>
            </div>

            <span className="rental-results-count">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "item" : "items"} available
            </span>
          </div>

          <div className="category-filters">
  {["All", ...categories.map((category) => category.name)].map(
    (category) => (
      <button
        key={category}
        className={
          selectedCategory === category
            ? "filter-button active"
            : "filter-button"
        }
        onClick={() => {
          setSelectedCategory(category);
          setSearch("");
        }}
      >
        {category}
      </button>
    )
  )}
</div>
          <div className="trending-products-row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  className="trending-product-item"
                  key={product.id}
                >
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
             <div className="no-products">
  <h3>
    No {selectedCategory === "All" ? "" : `${selectedCategory} `}
    rentals available yet
  </h3>

  <p>
    We're working on adding more products. Try another category
    or explore all available rentals.
  </p>

  <button
    onClick={() => {
      setSearch("");
      setSelectedCategory("All");
    }}
  >
    View all rentals
  </button>
</div>
            )}
          </div>
        </section>

        {/* RENTAL PACKAGES */}
        <section className="package-promo">
          <div className="package-copy">
            <span className="section-label">
              MORE VALUE, LESS COMMITMENT
            </span>

            <h2>
              Everything you need.
              <br />
              <span>One easy rental.</span>
            </h2>

            <p>
              Build your own bundle for a move, a project, or a fresh
              start.
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("life-mode")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore rental bundles <ArrowRight size={17} />
            </button>
          </div>

          <div
            className="package-photo"
            style={{
              backgroundImage: `url("${imageUrl(
                "photo-1555041469-a586c61ea9bc"
              )}")`,
            }}
          >
            <span className="package-sticker">
              FLEXIBLE
              <br />
              BY DESIGN
            </span>
          </div>
        </section>

        {/* LIFE MODE */}
        <section className="life-mode-section" id="life-mode">
          <div className="life-mode-container">
            <div className="life-mode-intro">
              <span className="section-label">
                RENTIFY LIFE MODE
              </span>

              <h2>
                Rent for the life
                <br />
                you're <span>living.</span>
              </h2>

              <p>
                Tell us what you're planning. We'll help you find the
                right rentals for the moment.
              </p>
            </div>

            <div className="life-mode-grid">
              {lifeModes.map((mode) => (
                <button
                  className="life-mode-card"
                  key={mode.title}
                  onClick={() => navigate("/life-mode")}
                >
                  <span className="life-mode-emoji">
                    {mode.emoji}
                  </span>

                  <h3>{mode.title}</h3>

                  <p>{mode.description}</p>

                  <span className="life-mode-link">
                    Explore solution <ArrowRight size={16} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* WHY RENTIFY */}
        <section className="why-rentify-section">
          <div className="why-copy">
            <span className="section-label">
              A BETTER WAY TO GET WHAT YOU NEED
            </span>

            <h2>
              Why <span>Rentify</span> makes sense
            </h2>

            <p>
              Get access to the things you need without the long-term
              cost and clutter of ownership.
            </p>

            <div className="benefit-table">
              {[
                "Keep more money for what matters",
                "Choose flexible rental durations",
                "Use things only when you need them",
                "Make room for changing plans",
              ].map((benefit) => (
                <div key={benefit}>
                  <span>{benefit}</span>
                  <CircleCheck size={20} />
                </div>
              ))}
            </div>
          </div>

          <div className="why-photo">
            <img
              src={imageUrl("photo-1616486338812-3dadae4b4ace")}
              alt="Comfortable, modern living space"
            />

            <div className="why-photo-card">
              <ShieldCheck size={22} />

              <div>
                <strong>Rent with flexibility</strong>
                <span>Your needs. Your timeline.</span>
              </div>
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS */}
        <section className="reviews-section">
          <div className="reviews-heading">
            <span className="section-label">
              THE RENTIFY EXPERIENCE
            </span>

            <h2>
              Good things are <span>shared.</span>
            </h2>

            <p>
              Why a flexible way to rent fits modern life.
            </p>
          </div>

          <div className="reviews-grid">
            {reviews.map((review) => (
              <article className="review-card" key={review.name}>
                <div
                  className="review-stars"
                  aria-label="5 out of 5 stars"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      fill="currentColor"
                    />
                  ))}
                </div>

                <p>“{review.text}”</p>

                <strong>{review.name}</strong>
                <span>Rentify community</span>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="rentify-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              rentify<span>.</span>
            </a>

            <p>Rent smarter. Live your way.</p>
          </div>

          <div className="footer-links">
            <a href="#popular-rentals">Explore rentals</a>
            <a href="#more-categories">Categories</a>
            <a href="#life-mode">Life Mode</a>
            <a href="/my-bookings">My bookings</a>
          </div>

          <span className="footer-tagline">
            <Sparkles size={16} />
            Made for changing plans.
          </span>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Rentify</span>
          <span>Flexible rentals for real life.</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;