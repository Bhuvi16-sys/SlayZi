import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, User, Mail, Lock, Building, AlertCircle, Loader2 } from "lucide-react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      await register(email, password, fullName, companyName);
      navigate(redirect);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("An error occurred during registration. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] glow-purple-blur opacity-30 pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] glow-pink-blur opacity-25 pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-2xl border border-white/5 relative z-10 text-left"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-light flex items-center justify-center mb-4">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white font-display">Create Account</h2>
          <p className="text-slate-400 text-xs mt-1.5">Register to secure custom build proposals and operations blueprints.</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5 leading-relaxed"
            >
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Full Name */}
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#07070F] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple focus:shadow-glow transition-all"
                placeholder="Jane Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wider">Business Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#07070F] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple focus:shadow-glow transition-all"
                placeholder="jane@company.com"
              />
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wider">Company Name (Optional)</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#07070F] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple focus:shadow-glow transition-all"
                placeholder="Acme Corp"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wider">Password (Min 6 Characters)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#07070F] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple focus:shadow-glow transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-strong disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all mt-2"
          >
            {loading ? (
              <>
                Registering Account...
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Create Account
                <UserPlus className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{" "}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-brand-light font-bold hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
