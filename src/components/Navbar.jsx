import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import Logo from "./Logo";
import { MagneticButton } from "./MagneticButton";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, logout } = useAuth();

  const navLinks = [
    { label: "Home", link: "/" },
    { label: "Marketplace", link: "/agents" },
    { label: "About", link: "/about" },
  ];

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          isScrolled
            ? "bg-[#0A0A0F]/70 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group relative z-10 pt-1.5">
            <Logo />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 bg-white/5 border border-white/5 rounded-full px-8 py-2.5 backdrop-blur-md">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.link}
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors relative group"
              >
                {item.label}
                {location.pathname === item.link && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-light rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4 relative z-10">
            {user ? (
              <div className="hidden md:flex items-center gap-4 animate-fade-in">
                <span className="text-xs text-slate-300 font-medium font-display">
                  Hi, {profile?.fullName?.split(" ")[0] || "User"}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-red-500/10 hover:border-red-500/20 text-xs font-bold text-slate-300 hover:text-red-400 transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden md:block">
                <Link
                  to="/login"
                  className="px-4.5 py-2.5 rounded-full border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-colors mr-1 hover:bg-white/5"
                >
                  Sign In
                </Link>
              </div>
            )}

            <div className="hidden md:block">
              <Link to="/custom" className="">
                <MagneticButton className="px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink text-white text-xs font-bold shadow-glow hover:shadow-glow-strong border border-white/10">
                  Book Custom Build
                </MagneticButton>
              </Link>
            </div>
            
            {/* Mobile Hamburger Toggle */}
            <button
              className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <Icons.X className="h-6 w-6" /> : <Icons.Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[90] bg-[#0A0A0F]/95 backdrop-blur-2xl md:hidden pt-24 pb-8 px-6 flex flex-col overflow-y-auto"
          >
            <div className="flex flex-col gap-6 text-2xl font-display font-bold">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.link}
                  className={`text-left transition-colors ${
                    location.pathname === item.link ? "text-brand-light" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px w-full bg-white/10 my-2" />
              
              {user ? (
                <div className="flex flex-col gap-4 text-left">
                  <div className="text-xs font-display text-slate-400 leading-none">
                    Signed in as: <span className="text-white font-bold">{profile?.fullName || user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-lg font-bold hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="w-full">
                  <button className="w-full py-4 rounded-xl border border-white/10 bg-white/5 text-white text-lg font-bold hover:bg-white/10 transition-colors cursor-pointer">
                    Sign In
                  </button>
                </Link>
              )}

              <Link to="/custom" className="w-full">
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white text-lg font-bold shadow-glow border border-white/10 cursor-pointer">
                  Book Custom Build
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
