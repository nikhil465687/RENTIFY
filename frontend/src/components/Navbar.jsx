import { Link, useNavigate } from "react-router-dom";
import { Search, UserRound, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import "./Navbar.css";

function Navbar({ search = "", setSearch = () => {} }) {
  const navigate = useNavigate();
  const { items } = useCart();
  const submitSearch = (event) => {
    event.preventDefault();
    navigate("/");
    window.setTimeout(() => document.getElementById("popular-rentals")?.scrollIntoView({ behavior: "smooth" }), 80);
  };
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">rentify<span>.</span></Link>
      <form className="navbar-search" onSubmit={submitSearch}>
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for products to rent" aria-label="Search rentals" />
        <button type="submit" aria-label="Search"><Search size={19} /></button>
      </form>
      <div className="navbar-links">
        <Link to="/">Home</Link><Link to="/">Explore</Link><a href="/#more-categories">Categories</a><Link to="/life-mode">Life Mode</Link><Link to="/my-bookings">My Bookings</Link>
      </div>
      <div className="navbar-actions">
        <Link to="/cart" className="navbar-icon navbar-cart" aria-label={`Cart with ${items.length} items`}>
          <ShoppingBag size={21} /><span className="cart-count-badge">{items.length}</span>
        </Link>
        <Link to="/login" className="navbar-login"><UserRound size={17} /><span>Login/Signup</span></Link>
      </div>
    </nav>
  );
}
export default Navbar;
