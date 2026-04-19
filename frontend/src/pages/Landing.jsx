import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <h1 style={{ fontSize: 40, marginBottom: 12 }}>Welcome to Airbnb</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>Find unique stays or share your space with the world.</p>
      <div className="grid grid-3">
        <div className="card" style={{ padding: 24 }}>
          <h2>I'm a Guest</h2>
          <p style={{ color: "#666", margin: "12px 0" }}>Browse and book amazing stays.</p>
          <Link to="/register?role=guest"><button className="btn">Sign up as Guest</button></Link>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h2>I'm an Owner</h2>
          <p style={{ color: "#666", margin: "12px 0" }}>List your property and earn.</p>
          <Link to="/register?role=owner"><button className="btn">Sign up as Owner</button></Link>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h2>Explore</h2>
          <p style={{ color: "#666", margin: "12px 0" }}>See all available stays.</p>
          <Link to="/listings"><button className="btn-outline">Browse Listings</button></Link>
        </div>
      </div>
    </div>
  );
}
