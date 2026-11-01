import {
  MapPin,
  ArrowUpRight,
  ShoppingCart,
  Check,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const inCart = items.some(
    (item) => item.id === product.id
  );

  const isUnavailable = product.available === false;
  const hasAIRecommendation = Boolean(
    product.priority || product.reason
  );

  const priorityClass = (
    product.priority || "Recommended"
  ).toLowerCase();

  const handleAdd = (event) => {
    event.stopPropagation();
    addToCart(product);
  };

  const handleView = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <article
      className={`product-card ${hasAIRecommendation ? "product-card-ai" : ""}`}
      onClick={handleView}
    >
      <div className={`product-image ${product.imageClass || ""}`}>
        <span className="product-category">
          {product.category}
        </span>

        {hasAIRecommendation && (
          <span className="product-ai-tag">
            <Sparkles size={12} />
            AI PICK
          </span>
        )}

        {isUnavailable && (
          <span className="product-unavailable-badge">
            Unavailable
          </span>
        )}

        <span className="product-emoji">
          {product.emoji || "📦"}
        </span>
      </div>

      <div className="product-details">
        <div className="product-heading">
          <h3>{product.name}</h3>

          {product.rating != null && (
            <span className="product-rating">
              ★ {product.rating}
            </span>
          )}
        </div>

        <div className="product-location">
          <MapPin size={14} />
          <span>{product.location}</span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            <h4>
              ₹{product.price}
              <span> / day</span>
            </h4>
          </div>
        </div>

        {hasAIRecommendation && (
          <div className="product-recommendation">
            <div className="product-recommendation-top">
              <span className={`product-priority-badge ${priorityClass}`}>
                {product.priority || "Recommended"}
              </span>

              {Number.isFinite(Number(product.relevanceScore)) && (
                <span className="product-match-score">
                  {Math.round(Number(product.relevanceScore))}% match
                </span>
              )}
            </div>

            {product.reason && (
              <p className="product-reason">
                <Sparkles size={13} />
                <span>{product.reason}</span>
              </p>
            )}
          </div>
        )}

        <div className="product-card-actions">
          <button
            className="product-add-button"
            onClick={handleAdd}
            onKeyDown={(event) => event.stopPropagation()}
            disabled={isUnavailable}
          >
            {inCart ? <Check size={15} /> : <ShoppingCart size={15} />}
            {inCart ? "Add More" : "Add to Cart"}
          </button>

          <button
            className="product-view-button"
            onClick={(event) => {
              event.stopPropagation();
              handleView();
            }}
          >
            View Details
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
