import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Listings from "./pages/Listings.jsx";
import ListingDetail from "./pages/ListingDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AddListing from "./pages/AddListing.jsx";
import EditListing from "./pages/EditListing.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import MyBookings from "./pages/MyBookings.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-listing" element={<AddListing />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route path="/dashboard" element={<OwnerDashboard />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </>
  );
}
