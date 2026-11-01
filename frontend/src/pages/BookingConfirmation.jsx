import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  CheckCircle,
  Package,
  User,
  Phone,
  Mail,
  Home,
  Map,
} from "lucide-react";

import { useCart } from "../components/CartContext";

import "./BookingConfirmation.css";

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { clearCart } = useCart();

  const booking = location.state;

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    house: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    instructions: "",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check booking details
  if (
    !booking ||
    (!booking.product && !Array.isArray(booking.items))
  ) {
    return (
      <div className="booking-not-found">
        <h2>No booking details found</h2>

        <p>Please select products and rental dates first.</p>

        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  // Support multiple products and older single-product bookings
  const bookings =
    booking.items ||
    [
      {
        ...booking,
        quantity: booking.quantity || 1,
      },
    ];

  // Calculate grand total
  const totalPrice =
    booking.totalPrice ??
    bookings.reduce(
      (sum, item) => sum + Number(item.totalPrice || 0),
      0
    );

  const rentalCity =
    booking.city ||
    bookings[0]?.product?.location ||
    bookings[0]?.location ||
    "";

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setFormError("");
  };

  // Validate customer information
  const validateForm = () => {
    const newErrors = {};

    if (!customer.name.trim()) {
      newErrors.name = "Please enter your full name.";
    }

    if (!/^[6-9]\d{9}$/.test(customer.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!customer.house.trim()) {
      newErrors.house = "House/Flat number is required.";
    }

    if (!customer.street.trim()) {
      newErrors.street = "Street/Area is required.";
    }

    if (!customer.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!customer.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!/^\d{6}$/.test(customer.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit PIN code.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Confirm booking
  const confirmBooking = (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) {
      setFormError("Please correct the highlighted fields.");
      return;
    }

    if (!Number.isFinite(Number(totalPrice)) || Number(totalPrice) <= 0) {
      setFormError("Invalid booking total. Please return to your cart.");
      return;
    }

    setIsSubmitting(true);

    try {
      const existing = JSON.parse(
        localStorage.getItem("rentifyBookings") || "[]"
      );

      const newBooking = {
        bookingId: `RNT-${Date.now()}`,

        customer: {
          name: customer.name.trim(),
          phone: customer.phone,
          email: customer.email.trim(),

          address: {
            house: customer.house.trim(),
            street: customer.street.trim(),
            landmark: customer.landmark.trim(),
            city: customer.city.trim(),
            state: customer.state.trim(),
            pincode: customer.pincode,
            instructions: customer.instructions.trim(),
          },
        },

        products: bookings.map((entry) => ({
          product: entry.product || entry,

          startDate: entry.startDate,
          endDate: entry.endDate,

          rentalDays: entry.rentalDays,

          quantity: Number(entry.quantity) || 1,

          price: Number(entry.price) || 0,

          totalPrice: Number(entry.totalPrice) || 0,
        })),

        // Legacy compatibility
        product: bookings[0].product || bookings[0],

        startDate: bookings[0].startDate,
        endDate: bookings[0].endDate,

        rentalDays: bookings[0].rentalDays,

        quantity: Number(bookings[0].quantity) || 1,

        totalPrice: Number(totalPrice),

        city: rentalCity,

        status: "Confirmed",

        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "rentifyBookings",
        JSON.stringify([newBooking, ...existing])
      );

      // Clear cart after successful booking
      if (booking.items) {
        clearCart();
      }

      navigate("/my-bookings", {
        state: { bookingConfirmed: true },
      });

    } catch (error) {
      console.error("Booking error:", error);

      setFormError(
        "Unable to save your booking. Please try again."
      );

      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-confirmation-page">

      <button
        className="booking-back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="booking-confirmation-container">

        {/* HEADER */}

        <div className="booking-confirmation-header">

          <CheckCircle size={48} />

          <h1>Complete Your Booking</h1>

          <p>
            Enter your details and review your rental order.
          </p>

        </div>

        <form onSubmit={confirmBooking}>

          {/* CUSTOMER INFORMATION */}

          <section className="customer-form-section">

            <div className="customer-section-heading">
              <User size={21} />

              <div>
                <h2>Personal Information</h2>
                <p>Tell us how to contact you.</p>
              </div>
            </div>

            <div className="customer-form-grid">

              <div className="customer-form-group full-width">
                <label>Full Name *</label>

                <div className="customer-input-wrapper">
                  <User size={17} />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={customer.name}
                    onChange={handleChange}
                  />
                </div>

                {errors.name && (
                  <small className="customer-error">
                    {errors.name}
                  </small>
                )}
              </div>

              <div className="customer-form-group">
                <label>Mobile Number *</label>

                <div className="customer-input-wrapper">
                  <Phone size={17} />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={customer.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      setCustomer((previous) => ({
                        ...previous,
                        phone: value,
                      }));

                      setErrors((previous) => ({
                        ...previous,
                        phone: "",
                      }));
                    }}
                  />
                </div>

                {errors.phone && (
                  <small className="customer-error">
                    {errors.phone}
                  </small>
                )}
              </div>

              <div className="customer-form-group">
                <label>Email Address *</label>

                <div className="customer-input-wrapper">
                  <Mail size={17} />

                  <input
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    value={customer.email}
                    onChange={handleChange}
                  />
                </div>

                {errors.email && (
                  <small className="customer-error">
                    {errors.email}
                  </small>
                )}
              </div>

            </div>

          </section>

          {/* DELIVERY ADDRESS */}

          <section className="customer-form-section">

            <div className="customer-section-heading">
              <Home size={21} />

              <div>
                <h2>Delivery Address</h2>
                <p>Where should we deliver your rental?</p>
              </div>
            </div>

            <div className="customer-form-grid">

              <div className="customer-form-group">
                <label>House / Flat Number *</label>

                <input
                  type="text"
                  name="house"
                  placeholder="House no. / Flat no."
                  value={customer.house}
                  onChange={handleChange}
                />

                {errors.house && (
                  <small className="customer-error">
                    {errors.house}
                  </small>
                )}
              </div>

              <div className="customer-form-group">
                <label>Street / Area *</label>

                <input
                  type="text"
                  name="street"
                  placeholder="Street or locality"
                  value={customer.street}
                  onChange={handleChange}
                />

                {errors.street && (
                  <small className="customer-error">
                    {errors.street}
                  </small>
                )}
              </div>

              <div className="customer-form-group full-width">
                <label>Landmark</label>

                <input
                  type="text"
                  name="landmark"
                  placeholder="Nearby landmark (optional)"
                  value={customer.landmark}
                  onChange={handleChange}
                />
              </div>

              <div className="customer-form-group">
                <label>City *</label>

                <div className="customer-input-wrapper">
                  <MapPin size={17} />

                  <input
                    type="text"
                    name="city"
                    placeholder="Enter your city"
                    value={customer.city}
                    onChange={handleChange}
                  />
                </div>

                {errors.city && (
                  <small className="customer-error">
                    {errors.city}
                  </small>
                )}
              </div>

              <div className="customer-form-group">
                <label>State *</label>

                <div className="customer-input-wrapper">
                  <Map size={17} />

                  <input
                    type="text"
                    name="state"
                    placeholder="Enter your state"
                    value={customer.state}
                    onChange={handleChange}
                  />
                </div>

                {errors.state && (
                  <small className="customer-error">
                    {errors.state}
                  </small>
                )}
              </div>

              <div className="customer-form-group">
                <label>PIN Code *</label>

                <input
                  type="text"
                  name="pincode"
                  placeholder="6-digit PIN code"
                  maxLength={6}
                  value={customer.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    setCustomer((previous) => ({
                      ...previous,
                      pincode: value,
                    }));

                    setErrors((previous) => ({
                      ...previous,
                      pincode: "",
                    }));
                  }}
                />

                {errors.pincode && (
                  <small className="customer-error">
                    {errors.pincode}
                  </small>
                )}
              </div>

              <div className="customer-form-group full-width">
                <label>Delivery Instructions</label>

                <textarea
                  name="instructions"
                  placeholder="Any special delivery instructions? (Optional)"
                  rows="3"
                  value={customer.instructions}
                  onChange={handleChange}
                />
              </div>

            </div>

          </section>

          {/* RENTAL DETAILS */}

          <section className="booking-details-card">

            <h2>
              <Package size={19} />
              Rental Summary · {rentalCity}
            </h2>

            {bookings.map((entry, index) => {

              const product = entry.product || entry;

              const quantity = Number(entry.quantity) || 1;

              return (

                <div
                  className="multi-booking-line"
                  key={product.id || index}
                >

                  <div className="booking-summary-product">

                    <span className="booking-summary-emoji">
                      {product.emoji || "📦"}
                    </span>

                    <div>
                      <strong>{product.name}</strong>

                      <p>{product.location}</p>
                    </div>

                  </div>

                  <div className="booking-detail-row">
                    <span>Start Date</span>
                    <strong>{entry.startDate}</strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>End Date</span>
                    <strong>{entry.endDate}</strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>
                      <CalendarDays size={15} />
                      Duration
                    </span>

                    <strong>{entry.rentalDays} days</strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>Quantity</span>
                    <strong>{quantity} units</strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>Price per day</span>

                    <strong>
                      ₹{formatPrice(entry.price)}
                    </strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>Product Total</span>

                    <strong>
                      ₹{formatPrice(entry.totalPrice)}
                    </strong>
                  </div>

                </div>

              );

            })}

            <div className="booking-detail-row booking-total-row">
              <span>Grand Total</span>

              <strong>
                ₹{formatPrice(totalPrice)}
              </strong>
            </div>

          </section>

          {/* FORM ERROR */}

          {formError && (
            <div className="customer-form-error" role="alert">
              {formError}
            </div>
          )}

          {/* CONFIRM */}

          <button
            type="submit"
            className="confirm-booking-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : "Confirm Booking"}
          </button>

          <p className="booking-disclaimer">
            Your details will be saved with this booking.
            This is currently a frontend demonstration;
            information is stored in your browser.
          </p>

        </form>

      </div>

    </div>
  );
}

export default BookingConfirmation;