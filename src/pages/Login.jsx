import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password credentials.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("An error occurred during login. Please try again.");
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
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white font-display">Welcome Back</h2>
          <p className="text-slate-400 text-xs mt-1.5">Sign in to book and manage your custom AI agents.</p>
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
          {/* Email */}
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#07070F] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple focus:shadow-glow transition-all"
                placeholder="you@company.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Password</label>
            </div>
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
                Signing In...
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Sign In
                <LogIn className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{" "}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-brand-light font-bold hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
