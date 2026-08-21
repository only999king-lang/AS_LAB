import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench, LogIn } from "lucide-react";
import { api } from "@/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("aslabs_token", data.token);
      navigate("/admin");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-[#0B0C10] border border-[#282C3D] rounded-xl px-4 py-3 text-sm text-[#F4F5F7] placeholder-[#8A90A3]/60 focus:outline-none focus:border-[#FFB800] transition-colors duration-300";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" data-testid="admin-login-page">
      <div className="orb w-[400px] h-[400px] bg-[#FFB800]/10 -top-20 -left-20" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm bg-[#12141C] border border-[#282C3D] rounded-2xl p-8 shadow-2xl"
      >
        <Link to="/" className="flex items-center gap-2.5 mb-8" data-testid="admin-login-brand">
          <span className="w-9 h-9 rounded-lg bg-[#FFB800] flex items-center justify-center">
            <Wrench className="w-5 h-5 text-[#0B0C10]" strokeWidth={2.5} />
          </span>
          <span className="font-heading font-extrabold uppercase tracking-tight">
            AS<span className="text-[#FFB800]">Labs</span>
          </span>
        </Link>
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight">Admin Access</h1>
        <p className="font-mono2 text-xs text-[#8A90A3] mt-1 mb-6 uppercase tracking-wider">Owner login only</p>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            data-testid="admin-email-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
          <input
            type="password"
            required
            data-testid="admin-password-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
          {error && (
            <p className="text-sm text-[#EF4444]" data-testid="admin-login-error">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-button"
            className="w-full py-3.5 bg-[#FFB800] text-[#0B0C10] font-heading font-bold uppercase tracking-wide text-sm rounded-full hover:bg-[#E0A200] disabled:opacity-50 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            {loading ? "Checking…" : "Enter the Lab"}
            <LogIn className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}