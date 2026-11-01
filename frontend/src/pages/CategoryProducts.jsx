import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  PackageOpen,
  Search,
  SlidersHorizontal,
  MapPin,
} from "lucide-react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";

import "./CategoryProducts.css";

function CategoryProducts() {
  const { categoryName } = useParams();
const { products, loading, error } = useProducts();
  const selectedCategory = decodeURIComponent(categoryName);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [availableOnly, setAvailableOnly] = useState(true);

  // Get products belonging to this category
  const categoryProducts = products.filter((product) => {
    return (
      product.category?.toLowerCase() ===
        selectedCategory.toLowerCase() ||
      product.subcategory?.toLowerCase() ===
        selectedCategory.toLowerCase()
    );
  });

  // Get unique locations
  const locations = [
    "All",
    ...new Set(
      categoryProducts.map((product) => product.location).filter(Boolean)
    ),
  ];

  // Search and filter products
  let filteredProducts = categoryProducts.filter((product) => {
    const term = search.toLowerCase().trim();

    const matchesSearch =
      product.name?.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term);

    const matchesLocation =
      selectedLocation === "All" ||
      product.location === selectedLocation;

    const matchesAvailability =
      !availableOnly || product.available !== false;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesAvailability
    );
  });

  // Sort products
  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (sortBy === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setSelectedLocation("All");
    setSortBy("default");
    setAvailableOnly(true);
  };
     if (loading) {
  return (
    <div className="category-page">
      <Navbar />
      <div className="category-loading">
        Loading products...
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="category-page">
      <Navbar />
      <div className="category-loading">
        Unable to load products: {error}
      </div>
    </div>
  );
}

  return (
    <div className="category-page">

      <Navbar />

      <main className="category-page-container">

        {/* Breadcrumb */}
        <div className="category-breadcrumb">
          <Link to="/">
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <span>/</span>
          <span>{selectedCategory}</span>
        </div>

        {/* Category Heading */}
        <div className="category-page-heading">

          <div>
            <span className="section-label">
              EXPLORE RENTIFY
            </span>

            <h1>
              {selectedCategory}
              <span> Rentals</span>
            </h1>

            <p>
              Find the right products for your needs.
              Rent what you need, whenever you need it.
            </p>
          </div>

          <div className="category-product-count">
            <strong>{filteredProducts.length}</strong>

            <span>
              {filteredProducts.length === 1
                ? "Product available"
                : "Products available"}
            </span>
          </div>

        </div>

        {/* Filters */}
        <div className="category-filter-panel">

          <div className="category-search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder={`Search in ${selectedCategory}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="category-filter-control">

            <SlidersHorizontal size={18} />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Recommended</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
              <option value="rating">
                Highest Rated
              </option>
            </select>

          </div>

          <div className="category-filter-control">

            <MapPin size={18} />

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location === "All"
                    ? "All Locations"
                    : location}
                </option>
              ))}
            </select>

          </div>

          <label className="availability-filter">

            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />

            <span>Available only</span>

          </label>

          <button
            className="reset-filter-button"
            onClick={resetFilters}
          >
            Reset
          </button>

        </div>

        {/* Product Results */}
        <div className="category-results-heading">
          <h2>
            Available <span>Rentals</span>
          </h2>

          <p>
            Showing {filteredProducts.length} of{" "}
            {categoryProducts.length} products
          </p>
        </div>

        {filteredProducts.length > 0 ? (

          <div className="category-products-grid">

            {filteredProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}

          </div>

        ) : (

          <div className="category-empty-state">

            <PackageOpen size={55} />

            <h2>No rentals found</h2>

            <p>
              Try changing your search or filters to find
              available products.
            </p>

            <button
              className="back-home-button"
              onClick={resetFilters}
            >
              Clear Filters
            </button>

          </div>

        )}

      </main>

    </div>
  );
}

export default CategoryProducts;