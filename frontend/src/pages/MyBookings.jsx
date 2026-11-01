import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Package,
  ClipboardList,
  User,
  Phone,
  Mail,
  Home,
  Map,
} from "lucide-react";

import "./MyBookings.css";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    try {
      const savedBookings = JSON.parse(
        localStorage.getItem("rentifyBookings") || "[]"
      );

      setBookings(
        Array.isArray(savedBookings) ? savedBookings : []
      );
    } catch (error) {
      console.error("Unable to load bookings:", error);
      setBookings([]);
    }
  }, []);

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  // Support old and new booking formats
  const getBookingProducts = (booking) => {
    if (Array.isArray(booking.products)) {
      return booking.products;
    }

    return [
      {
        product: booking.product,
        startDate: booking.startDate,
        endDate: booking.endDate,
        rentalDays: booking.rentalDays,
        quantity: booking.quantity || 1,
        price: booking.product?.price || 0,
        totalPrice: booking.totalPrice || 0,
      },
    ];
  };

  return (
    <div className="my-bookings-page">

      {/* BACK BUTTON */}

      <button
        className="my-bookings-back"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Back to Home
      </button>

      {/* HEADER */}

      <div className="my-bookings-header">

        <div>
          <h1>My Bookings</h1>

          <p>
            Manage and track your rental bookings.
          </p>
        </div>

        <div className="booking-count">
          {bookings.length}{" "}
          {bookings.length === 1 ? "Booking" : "Bookings"}
        </div>

      </div>

      {/* EMPTY STATE */}

      {bookings.length === 0 ? (

        <div className="no-bookings">

          <ClipboardList size={55} />

          <h2>No bookings yet</h2>

          <p>
            Your confirmed rentals will appear here.
          </p>

          <button onClick={() => navigate("/")}>
            Explore Rentals
          </button>

        </div>

      ) : (

        <div className="my-bookings-list">

          {bookings.map((booking, index) => {

            const products = getBookingProducts(booking);

            const customer = booking.customer || {};
            const address = customer.address || {};

            const grandTotal = Number(
              booking.totalPrice ??
              products.reduce(
                (sum, item) =>
                  sum + Number(item.totalPrice || 0),
                0
              )
            );

            return (

              <div
                className="my-booking-card"
                key={booking.bookingId || index}
              >

                {/* BOOKING HEADER */}

                <div className="my-booking-header">

                  <div>

                    <span className="booking-id">
                      Booking ID: {booking.bookingId || "N/A"}
                    </span>

                    <p>
                      <MapPin size={15} />

                      {booking.city ||
                        products[0]?.product?.location ||
                        "N/A"}
                    </p>

                    {booking.createdAt && (
                      <span className="booking-date">
                        Booked on:{" "}
                        {new Date(
                          booking.createdAt
                        ).toLocaleDateString("en-IN")}
                      </span>
                    )}

                  </div>

                  <span className="booking-confirmed">
                    ● {booking.status || "Confirmed"}
                  </span>

                </div>

                {/* CUSTOMER INFORMATION */}

                <section className="booking-customer-card">

                  <div className="booking-customer-heading">

                    <User size={20} />

                    <div>
                      <h3>Customer Information</h3>
                      <p>Booking contact details</p>
                    </div>

                  </div>

                  <div className="booking-customer-grid">

                    <div className="booking-customer-field">

                      <span>
                        <User size={15} />
                        Full Name
                      </span>

                      <strong>
                        {customer.name || "Not provided"}
                      </strong>

                    </div>

                    <div className="booking-customer-field">

                      <span>
                        <Phone size={15} />
                        Mobile Number
                      </span>

                      <strong>
                        {customer.phone || "Not provided"}
                      </strong>

                    </div>

                    <div className="booking-customer-field">

                      <span>
                        <Mail size={15} />
                        Email Address
                      </span>

                      <strong>
                        {customer.email || "Not provided"}
                      </strong>

                    </div>

                  </div>

                  {/* DELIVERY ADDRESS */}

                  <div className="booking-address-section">

                    <h4>
                      <Home size={17} />
                      Delivery Address
                    </h4>

                    <div className="booking-address-grid">

                      <div className="booking-customer-field">

                        <span>House / Flat</span>

                        <strong>
                          {address.house || "N/A"}
                        </strong>

                      </div>

                      <div className="booking-customer-field">

                        <span>Street / Area</span>

                        <strong>
                          {address.street || "N/A"}
                        </strong>

                      </div>

                      <div className="booking-customer-field">

                        <span>Landmark</span>

                        <strong>
                          {address.landmark || "N/A"}
                        </strong>

                      </div>

                      <div className="booking-customer-field">

                        <span>
                          <Map size={15} />
                          City
                        </span>

                        <strong>
                          {address.city || "N/A"}
                        </strong>

                      </div>

                      <div className="booking-customer-field">

                        <span>State</span>

                        <strong>
                          {address.state || "N/A"}
                        </strong>

                      </div>

                      <div className="booking-customer-field">

                        <span>PIN Code</span>

                        <strong>
                          {address.pincode || "N/A"}
                        </strong>

                      </div>

                    </div>

                    {address.instructions && (
                      <div className="booking-instructions">

                        <strong>
                          Delivery Instructions:
                        </strong>

                        <p>{address.instructions}</p>

                      </div>
                    )}

                  </div>

                </section>

                {/* ALL PRODUCTS */}

                <h3 className="booking-products-heading">
                  <Package size={19} />
                  Rental Products
                </h3>

                {products.map((item, productIndex) => {

                  const product =
                    item.product || item;

                  const quantity =
                    Number(item.quantity) || 1;

                  return (

                    <div
                      className="my-booking-product-entry"
                      key={product.id || productIndex}
                    >

                      {/* PRODUCT INFORMATION */}

                      <div className="my-booking-product">

                        <div className="my-booking-image">

                          <span>
                            {product.emoji || (
                              <Package size={45} />
                            )}
                          </span>

                        </div>

                        <div className="my-booking-product-info">

                          <span className="my-booking-category">
                            {product.category}
                          </span>

                          <h2>{product.name}</h2>

                          <p>
                            <MapPin size={15} />
                            {product.location}
                          </p>

                        </div>

                      </div>

                      {/* RENTAL DETAILS */}

                      <div className="my-booking-details">

                        <div>
                          <span>Start Date</span>

                          <strong>
                            {item.startDate || "N/A"}
                          </strong>
                        </div>

                        <div>
                          <span>End Date</span>

                          <strong>
                            {item.endDate || "N/A"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            <CalendarDays size={15} />
                            Duration
                          </span>

                          <strong>
                            {item.rentalDays || 0} days
                          </strong>
                        </div>

                        <div>
                          <span>Quantity</span>

                          <strong>
                            {quantity} units
                          </strong>
                        </div>

                        <div>
                          <span>Price per day</span>

                          <strong>
                            ₹{formatPrice(
                              item.price ?? product.price
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Product Total</span>

                          <strong className="my-booking-price">
                            ₹{formatPrice(item.totalPrice)}
                          </strong>
                        </div>

                      </div>

                    </div>

                  );

                })}

                {/* BOOKING FOOTER */}

                <div className="my-booking-footer">

                  <span>
                    {products.length}{" "}
                    {products.length === 1
                      ? "Product"
                      : "Products"}{" "}
                    ·{" "}
                    {products.reduce(
                      (sum, item) =>
                        sum + (Number(item.quantity) || 1),
                      0
                    )}{" "}
                    Units
                  </span>

                  <strong className="my-booking-price">
                    Grand Total: ₹{formatPrice(grandTotal)}
                  </strong>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
}

export default MyBookings;