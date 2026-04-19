import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Swal from "sweetalert2";

export default function Register() {
  const [params] = useSearchParams();
  const initialRole = params.get("role") === "owner" ? "owner" : "guest";
  const [form, setForm] = useState({
    name: "", email: "", phone: "", age: "", aadhar: "", pan: "",
    password: "", confirm: "", role: initialRole,
  });
  const { login } = useAuth();
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    if (Number(form.age) < 18) return Swal.fire({ icon: "error", title: "Under 18", text: "You must be 18+ to register." });
    if (form.password !== form.confirm) return Swal.fire({ icon: "error", title: "Passwords do not match" });
    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      Swal.fire({ icon: "success", title: "Account created!", timer: 1200, showConfirmButton: false });
      nav(data.user.role === "owner" ? "/dashboard" : "/listings");
    } catch (e) {
      Swal.fire({ icon: "error", title: "Registration failed", text: e.response?.data?.message || e.message });
    }
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <div className="container" style={{ maxWidth: 520, paddingTop: 40 }}>
      <h2>Create Account</h2>
      <form onSubmit={submit}>
        <label className="label">Role</label>
        <select className="input" value={form.role} onChange={set("role")}>
          <option value="guest">Guest</option>
          <option value="owner">Owner</option>
        </select>
        <label className="label">Name</label><input className="input" required value={form.name} onChange={set("name")} />
        <label className="label">Email</label><input className="input" type="email" required value={form.email} onChange={set("email")} />
        <label className="label">Phone</label><input className="input" value={form.phone} onChange={set("phone")} />
        <label className="label">Age</label><input className="input" type="number" required value={form.age} onChange={set("age")} />
        <label className="label">Aadhar</label><input className="input" required value={form.aadhar} onChange={set("aadhar")} />
        <label className="label">PAN</label><input className="input" required value={form.pan} onChange={set("pan")} />
        <label className="label">Password</label><input className="input" type="password" required value={form.password} onChange={set("password")} />
        <label className="label">Confirm Password</label><input className="input" type="password" required value={form.confirm} onChange={set("confirm")} />
        <button className="btn" style={{ marginTop: 20, width: "100%" }} type="submit">Register</button>
      </form>
    </div>
  );
}
