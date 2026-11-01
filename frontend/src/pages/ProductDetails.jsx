import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import products from "../data/products";
import "./ProductDetails.css";

function ProductDetails() {
      const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(
    (item) => String(item.id) === id
  );

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

   const calculateDays = () => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end - start;

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  const rentalDays = calculateDays();

  const totalPrice = rentalDays * product.price;

  return (
    <div className="product-details-page">

      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="product-details-container">

        <div className={`product-details-image ${product.imageClass}`}>
          <span>{product.emoji}</span>
        </div>

        <div className="product-details-info">

          <span className="product-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <div className="product-details-meta">

            <span>
              <Star size={16} />
              {product.rating}
            </span>

            <span>
              <MapPin size={16} />
              {product.location}
            </span>

          </div>

          <p className="product-description">
            {product.description}
          </p>

          <div className="product-owner">
            <span>Listed by</span>
            <strong>{product.owner}</strong>
          </div>


        <div className="rental-date-section">

  <h3>Select Rental Dates</h3>

  <div className="rental-date-fields">

    <div className="rental-date-field">
      <label>Start Date</label>

      <input
        type="date"
        value={startDate}
        min={new Date().toISOString().split("T")[0]}
        onChange={(e) => {
          setStartDate(e.target.value);

          if (endDate && e.target.value >= endDate) {
            setEndDate("");
          }
        }}
      />
    </div>

    <div className="rental-date-field">
      <label>End Date</label>

      <input
        type="date"
        value={endDate}
        min={
          startDate
            ? new Date(
                new Date(startDate).getTime() +
                  86400000
              )
                .toISOString()
                .split("T")[0]
            : new Date().toISOString().split("T")[0]
        }
        onChange={(e) => setEndDate(e.target.value)}
        disabled={!startDate}
      />
    </div>

  </div>

</div>





          <div className="product-details-price">
            <h2>₹{product.price}</h2>
            <span>/ day</span>
          </div>
{rentalDays > 0 && (
  <div className="rental-summary">

    <h3>Rental Summary</h3>

    <div className="rental-summary-row">
      <span>Rental Duration</span>
      <strong>{rentalDays} days</strong>
    </div>

    <div className="rental-summary-row">
      <span>Price per day</span>
      <strong>₹{product.price}</strong>
    </div>

    <div className="rental-summary-row rental-total">
      <span>Total Rental Price</span>
      <strong>₹{totalPrice}</strong>
    </div>

  </div>
)}

       <button
  className="book-now-button"
  disabled={rentalDays === 0}
  onClick={() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedStart = new Date(`${startDate}T00:00:00`);
  const selectedEnd = new Date(`${endDate}T00:00:00`);

  if (
    selectedStart < today ||
    selectedEnd <= selectedStart
  ) {
    alert("Please select valid future rental dates.");
    return;
  }

  navigate("/booking-confirmation", {
    state: {
      product,
      startDate,
      endDate,
      rentalDays,
      totalPrice
    }
  });
}}
>
  Book Now
</button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;