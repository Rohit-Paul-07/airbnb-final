import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <nav className="navbar">
      <Link to="/" style={{ display: "flex", alignItems: "center" }}>
        <img src="/airbnb.svg" alt="Airbnb" style={{height: 50, width: 154}} />
      </Link>
      <div className="navbar-links">
        <Link to="/listings">Explore</Link>
        {user?.role === "owner" && <Link to="/dashboard">Dashboard</Link>}
        {user?.role === "owner" && <Link to="/add-listing">Add Listing</Link>}
        {user?.role === "guest" && <Link to="/my-bookings">My Bookings</Link>}
        {user ? (
          <>
            <span className="badge-gray">{user.role === "owner" ? "Owner" : "Guest"}</span>
            <span>{user.name}</span>
            <button className="btn-outline" onClick={() => { logout(); nav("/"); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
