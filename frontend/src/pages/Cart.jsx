import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

import { useCart } from "../components/CartContext";
import Navbar from "../components/Navbar";

import "./Cart.css";

// Get today's date in YYYY-MM-DD format
const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const today = getToday();

// Calculate rental days
const daysBetween = (start, end) => {
  if (!start || !end) return 0;

  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);

  const days = Math.round(
    (endDate - startDate) / 86400000
  );

  return days > 0 ? days : 0;
};

function Cart() {
  const navigate = useNavigate();

  const [validationError, setValidationError] = useState("");

  const {
    items,
    city,
    removeFromCart,
    updateDates,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  // Calculate product-wise rental charges
  const lineItems = items.map((item) => {
    const rentalDays = daysBetween(
      item.startDate,
      item.endDate
    );

    const quantity = Math.max(
      1,
      Math.floor(Number(item.quantity) || 1)
    );

    const price = Number(item.price);

    const totalPrice =
      Number.isFinite(price) && price > 0
        ? rentalDays * price * quantity
        : 0;

    return {
      ...item,
      quantity,
      rentalDays,
      totalPrice,
    };
  });

  // Total number of units
  const totalQuantity = lineItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Complete rental amount
  const total = lineItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  // Validate every product
  const validateCart = () => {
    if (lineItems.length === 0) {
      return "Your cart is empty.";
    }

    for (const item of lineItems) {
      if (item.available === false) {
        return `${item.name} is currently unavailable.`;
      }

      if (
        !Number.isFinite(Number(item.price)) ||
        Number(item.price) <= 0
      ) {
        return `Invalid price for ${item.name}.`;
      }

      if (
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
      ) {
        return `Invalid quantity for ${item.name}.`;
      }

      if (!item.startDate || !item.endDate) {
        return `Please select rental dates for ${item.name}.`;
      }

      if (item.startDate < today) {
        return `Start date for ${item.name} cannot be in the past.`;
      }

      if (item.endDate <= item.startDate) {
        return `End date for ${item.name} must be after its start date.`;
      }

      if (item.rentalDays <= 0) {
        return `Please select valid rental dates for ${item.name}.`;
      }
    }

    if (total <= 0 || !Number.isFinite(total)) {
      return "Unable to calculate your rental total.";
    }

    return "";
  };

  // Checkout
  const checkout = () => {
    const error = validateCart();

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError("");

    navigate("/booking-confirmation", {
      state: {
        items: lineItems,
        city,
        totalPrice: total,
      },
    });
  };

  return (
    <div className="cart-page">

      <Navbar />

      <main className="cart-container">

        <Link to="/" className="cart-back">
          <ArrowLeft size={17} />
          Continue shopping
        </Link>

        {/* CART HEADING */}

        <div className="cart-title-row">
          <div>
            <span className="cart-eyebrow">
              YOUR RENTIFY SELECTION
            </span>

            <h1>
              Shopping <span>Cart</span>
            </h1>

            <p>
              {lineItems.length} products · {totalQuantity} units ·{" "}
              {city || "No city selected"}
            </p>
          </div>
        </div>

        {/* EMPTY CART */}

        {items.length === 0 ? (

          <section className="cart-empty">
            <ShoppingBag size={48} />

            <h2>Your cart is empty</h2>

            <p>
              Explore Rentify and add products you need.
            </p>

            <Link
              to="/"
              className="cart-primary-button"
            >
              Explore rentals
            </Link>
          </section>

        ) : (

          <div className="cart-layout">

            {/* CART PRODUCTS */}

            <section className="cart-items-list">

              <div className="cart-city-note">
                <MapPin size={17} />

                Your cart is restricted to{" "}
                <strong>{city}</strong>.
                All products must be from this city.
              </div>

              {lineItems.map((item) => (

                <article
                  className="cart-item"
                  key={item.id}
                >

                  {/* PRODUCT IMAGE */}

                  <div
                    className={`cart-item-image ${
                      item.imageClass || ""
                    }`}
                  >
                    <span>
                      {item.emoji || "📦"}
                    </span>
                  </div>

                  <div className="cart-item-main">

                    {/* PRODUCT DETAILS */}

                    <div className="cart-item-heading">

                      <div>
                        <span className="cart-item-category">
                          {item.category}
                        </span>

                        <h3>{item.name}</h3>

                        <p>
                          <MapPin size={14} />
                          {item.location}
                        </p>
                      </div>

                      <button
                        className="cart-remove"
                        onClick={() => {
                          removeFromCart(item.id);
                          setValidationError("");
                        }}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                    {/* QUANTITY CONTROL */}

                    <div className="cart-quantity-section">

                      <span>Quantity</span>

                      <div className="cart-quantity-control">

                        <button
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>

                        <strong>
                          {item.quantity}
                        </strong>

                        <button
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>

                      </div>

                    </div>

                    {/* RENTAL DATES */}

                    <div className="cart-date-fields">

                      <label>
                        <span>
                          <CalendarDays size={14} />
                          Start date
                        </span>

                        <input
                          type="date"
                          min={today}
                          value={item.startDate || ""}
                          onChange={(e) => {
                            updateDates(
                              item.id,
                              "startDate",
                              e.target.value
                            );
                            setValidationError("");
                          }}
                        />
                      </label>

                      <label>
                        <span>
                          <CalendarDays size={14} />
                          End date
                        </span>

                        <input
                          type="date"
                          min={
                            item.startDate
                              ? (() => {
                                  const nextDate = new Date(
                                    `${item.startDate}T00:00:00`
                                  );

                                  nextDate.setDate(
                                    nextDate.getDate() + 1
                                  );

                                  const year = nextDate.getFullYear();
                                  const month = String(
                                    nextDate.getMonth() + 1
                                  ).padStart(2, "0");
                                  const day = String(
                                    nextDate.getDate()
                                  ).padStart(2, "0");

                                  return `${year}-${month}-${day}`;
                                })()
                              : today
                          }
                          value={item.endDate || ""}
                          disabled={!item.startDate}
                          onChange={(e) => {
                            updateDates(
                              item.id,
                              "endDate",
                              e.target.value
                            );
                            setValidationError("");
                          }}
                        />
                      </label>

                    </div>

                    {/* PRODUCT TOTAL */}

                    <div className="cart-line-total">

                      <span>
                        ₹{item.price} × {item.quantity} units
                        {item.rentalDays > 0
                          ? ` × ${item.rentalDays} days`
                          : " · Select dates"}
                      </span>

                      <strong>
                        ₹{item.totalPrice.toLocaleString("en-IN")}
                      </strong>

                    </div>

                  </div>

                </article>

              ))}

              <button
                className="cart-clear-button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Remove all products from your cart?"
                    )
                  ) {
                    clearCart();
                    setValidationError("");
                  }
                }}
              >
                Clear cart
              </button>

            </section>

            {/* RENTAL SUMMARY */}

            <aside className="cart-summary">

              <h2>Rental Summary</h2>

              <div className="cart-summary-row">
                <span>Products</span>
                <strong>{lineItems.length}</strong>
              </div>

              <div className="cart-summary-row">
                <span>Total units</span>
                <strong>{totalQuantity}</strong>
              </div>

              <div className="cart-summary-row">
                <span>City</span>
                <strong>{city}</strong>
              </div>

              <div className="cart-summary-row">
                <span>Rental subtotal</span>
                <strong>
                  ₹{total.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="cart-summary-total">
                <span>Total</span>

                <strong>
                  ₹{total.toLocaleString("en-IN")}
                </strong>
              </div>

              <p>
                Each product has individual rental dates.
                Quantity and rental duration are included
                in the total calculation.
              </p>

              {/* VALIDATION ERROR */}

              {validationError && (
                <div
                  className="cart-validation-error"
                  role="alert"
                >
                  {validationError}
                </div>
              )}

              <button
                className="cart-checkout-button"
                onClick={checkout}
              >
                Proceed to Booking
              </button>

            </aside>

          </div>

        )}

      </main>

    </div>
  );
}

export default Cart;