import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Marketplace from "./pages/Marketplace";
import CustomBuild from "./pages/CustomBuild";
import About from "./pages/About";
import Logo, { LogoIcon } from "./components/Logo";
import Radar from "./components/Radar";

// Utility Component: Resets scroll state on navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Page Animation wrapper
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="flex-grow w-full"
    >
      {children}
    </motion.div>
  );
}

function Preloader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Show loading for 3 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="absolute inset-0">
        <Radar
          speed={1.0}
          scale={0.5}
          ringCount={10}
          spokeCount={10}
          ringThickness={0.05}
          spokeThickness={0.01}
          sweepSpeed={1.0}
          sweepWidth={2.0}
          sweepLobes={1}
          color="#9f29ff"
          backgroundColor="#000000"
          falloff={2.0}
          brightness={1.0}
          enableMouseInteraction={true}
          mouseInfluence={0.1}
        />
      </div>
      <div className="relative z-10 pointer-events-auto">
        <LogoIcon className="h-40 w-40 interactive-loading-logo ring-4 ring-white/20 rounded-xl bg-white p-2" />
      </div>
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Scroll Reset */}
      <ScrollToTop />
      
      {/* Navigation */}
      <Navbar />

      {/* Main Pages with Route Transition */}
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Landing />
                </PageTransition>
              }
            />
            <Route
              path="/agents"
              element={
                <PageTransition>
                  <Marketplace />
                </PageTransition>
              }
            />
            <Route
              path="/custom"
              element={
                <PageTransition>
                  <CustomBuild />
                </PageTransition>
              }
            />
            <Route
              path="/about"
              element={
                <PageTransition>
                  <About />
                </PageTransition>
              }
            />
            {/* Fallback to Home */}
            <Route
              path="*"
              element={
                <PageTransition>
                  <Landing />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-grow flex flex-col w-full h-full"
          >
            <AppContent />
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}
