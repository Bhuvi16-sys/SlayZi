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
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 4) + 2; // 2 to 5% increment
      current = Math.min(current + increment, 100);
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsLoaded(true);
      }
    }, 35); // takes around 1-1.5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLaunch = () => {
    // 1. Play futuristic synth chord
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const now = ctx.currentTime;

        // Chime: rising high synth notes (C major chord)
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          
          // Exponential decay
          gain.gain.setValueAtTime(0, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 1.3);
        });

        // Stereo-like ambient sweep/swell
        const oscSwell = ctx.createOscillator();
        const gainSwell = ctx.createGain();
        oscSwell.type = 'triangle';
        oscSwell.frequency.setValueAtTime(130.81, now); // C3 low drone
        oscSwell.frequency.linearRampToValueAtTime(261.63, now + 1.0); // slide to C4
        
        gainSwell.gain.setValueAtTime(0, now);
        gainSwell.gain.linearRampToValueAtTime(0.08, now + 0.4);
        gainSwell.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
        
        oscSwell.connect(gainSwell);
        gainSwell.connect(ctx.destination);
        
        oscSwell.start(now);
        oscSwell.stop(now + 2.1);
      }
    } catch (e) {
      console.warn("Web Audio API chime failed:", e);
    }

    // 2. Play welcome.wav file (using HTML5 Audio API)
    const audio = new Audio('/welcome.wav');
    audio.volume = 0.8;
    audio.play().catch((err) => console.warn("welcome.wav playback blocked or failed:", err));

    // 3. Complete preloader
    onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 z-0">
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

      <div className="relative z-10 flex flex-col items-center justify-center gap-12 pointer-events-auto px-6 max-w-md w-full">
        {/* Animated logo/icon wrapper */}
        <motion.div
          animate={isLoaded ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : {}}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <LogoIcon className="h-32 w-32 interactive-loading-logo ring-4 ring-white/10 rounded-2xl bg-white/95 p-3 shadow-[0_0_50px_rgba(159,41,255,0.3)]" />
        </motion.div>

        {/* Loading Progress & Enter Button Container */}
        <div className="w-full flex flex-col items-center gap-6 min-h-[90px]">
          <AnimatePresence mode="wait">
            {!isLoaded ? (
              <motion.div
                key="progress-bar-container"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center gap-3"
              >
                {/* Progress bar line */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-purple via-brand-pink to-brand-light rounded-full shadow-[0_0_12px_#7C3AED]"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.1 }}
                  />
                </div>
                {/* Percentage text */}
                <span className="font-mono text-xs tracking-[0.2em] text-brand-light font-semibold uppercase animate-pulse">
                  Initializing Core System... {progress}%
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="enter-button-container"
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-full flex flex-col items-center gap-3"
              >
                {/* Glowing Launch Button */}
                <button
                  onClick={handleLaunch}
                  className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-display font-bold tracking-[0.15em] text-sm uppercase shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.7)] border border-white/20 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group"
                >
                  Launch experience
                  <svg
                    className="w-4 h-4 text-white fill-current transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                {/* Audio Status */}
                <span className="font-sans text-[10px] tracking-[0.1em] text-slate-400 font-medium flex items-center gap-1.5 uppercase">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Audio Enabled • Welcome Sound Ready
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
