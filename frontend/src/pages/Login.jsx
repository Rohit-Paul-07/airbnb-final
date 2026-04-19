import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Swal from "sweetalert2";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      Swal.fire({ icon: "success", title: "Welcome back!", timer: 1200, showConfirmButton: false });
      nav(data.user.role === "owner" ? "/dashboard" : "/listings");
    } catch (e) {
      Swal.fire({ icon: "error", title: "Login failed", text: e.response?.data?.message || e.message });
    }
  };
  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: 40 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label className="label">Email</label>
        <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="label">Password</label>
        <input className="input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn" style={{ marginTop: 20, width: "100%" }} type="submit">Login</button>
      </form>
    </div>
  );
}
