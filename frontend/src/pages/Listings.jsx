import { useEffect, useState } from "react";
import api from "../utils/api.js";
import ListingCard from "../components/ListingCard.jsx";

const CATEGORIES = ["All", "Villa", "Apartment", "Cabin", "Beachfront", "Treehouse", "Tiny home", "Castle", "Lake", "Mountain", "Farm"];

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ location: "", minPrice: "", maxPrice: "", bedrooms: "", guests: "", category: "All" });
  const load = async () => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => v && v !== "All" && (params[k] = v));
    const { data } = await api.get("/listings", { params });
    setListings(data);
  };
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });
  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <input className="input" style={{ flex: 1, minWidth: 160 }} placeholder="Location" value={filters.location} onChange={set("location")} />
        <input className="input" style={{ width: 110 }} placeholder="Min ₹" value={filters.minPrice} onChange={set("minPrice")} />
        <input className="input" style={{ width: 110 }} placeholder="Max ₹" value={filters.maxPrice} onChange={set("maxPrice")} />
        <input className="input" style={{ width: 100 }} placeholder="Bedrooms" value={filters.bedrooms} onChange={set("bedrooms")} />
        <input className="input" style={{ width: 100 }} placeholder="Guests" value={filters.guests} onChange={set("guests")} />
        <button className="btn" onClick={load}>Search</button>
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20 }}>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => { setFilters({ ...filters, category: c }); setTimeout(load, 0); }}
            style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid #ddd", background: filters.category === c ? "#222" : "#fff", color: filters.category === c ? "#fff" : "#222", whiteSpace: "nowrap" }}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-3">
        {listings.map((l) => <ListingCard key={l._id} listing={l} />)}
        {listings.length === 0 && <p>No listings found.</p>}
      </div>
    </div>
  );
}
