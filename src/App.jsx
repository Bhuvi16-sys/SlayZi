import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Marketplace from "./pages/Marketplace";
import CustomBuild from "./pages/CustomBuild";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { LogoIcon } from "./components/Logo";
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

    // 2. Play welcome chime (via ElevenLabs API with fallback to welcome.wav)
    const audio = new Audio('/api/welcome-audio');
    audio.volume = 0.8;
    audio.play().catch((err) => console.warn("Welcome audio playback blocked or failed:", err));

    // 3. Complete preloader
    onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
      initial={{ clipPath: "circle(150% at 50% 50%)" }}
      exit={{ clipPath: "circle(0% at 50% 50%)" }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
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

        {/* Interactive Radar Matrix: Concentric CSS radial background rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
            className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full border border-brand-purple/20"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 0.96, 1] }}
            transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
            className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full border border-brand-pink/15"
          />
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full border border-brand-light/10"
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-12 pointer-events-auto px-6 max-w-md w-full">
        {/* Animated logo/icon wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isLoaded 
            ? { 
                opacity: 1,
                scale: [1, 1.03, 1], 
                boxShadow: ["0 0 30px rgba(159,41,255,0.2)", "0 0 60px rgba(159,41,255,0.5)", "0 0 30px rgba(159,41,255,0.2)"] 
              } 
            : { opacity: 1, scale: 1 }
          }
          transition={isLoaded ? { repeat: Infinity, duration: 3, ease: "easeInOut" } : { duration: 0.5 }}
          className="relative"
        >
          {/* Cyberpunk Outer Ring Aura */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-purple to-brand-pink blur-md opacity-40 animate-pulse" />
          
          <LogoIcon className="relative h-32 w-32 interactive-loading-logo border border-white/10 rounded-full bg-[#09090E]/60 backdrop-blur-md p-5 shadow-[0_0_50px_rgba(159,41,255,0.25)] text-white" />
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
                  className="w-full py-4 px-8 rounded-full bg-black/40 hover:bg-brand-purple/20 backdrop-blur-md text-white font-display font-bold tracking-[0.18em] text-xs uppercase shadow-[0_0_25px_rgba(124,58,237,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.45)] border border-brand-purple/30 hover:border-brand-light/60 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-500 cursor-pointer flex items-center justify-center gap-2.5 group"
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
  const { scrollYProgress } = useScroll();

  return (
    <div className="flex flex-col min-h-screen relative bg-[#0A0A0F] text-white">
      {/* Dynamic Cyberpunk AI Agent Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 grid-overlay opacity-30" />
        
        {/* Large glassmorphic glowing orbs with blur */}
        <div className="absolute top-[10%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-brand-purple/10 to-brand-pink/5 blur-[120px] mix-blend-screen opacity-70 animate-pulse-glow" />
        <div className="absolute bottom-[20%] right-[5%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-brand-violet/10 to-brand-light/5 blur-[140px] mix-blend-screen opacity-50 animate-pulse-glow" style={{ animationDelay: "-4s" }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] rounded-full bg-brand-pink/5 blur-[100px] mix-blend-screen opacity-40 animate-pulse-glow" style={{ animationDelay: "-2s" }} />
        
        {/* Ambient grid alignment visual cues (horizontal and vertical subtle lines) */}
        <div className="absolute top-1/4 right-[15%] w-[1px] h-[35vh] bg-gradient-to-b from-brand-purple/20 via-brand-pink/10 to-transparent blur-[0.5px]" />
        <div className="absolute bottom-1/3 left-[15%] w-[1px] h-[30vh] bg-gradient-to-t from-brand-pink/15 via-brand-purple/5 to-transparent blur-[0.5px]" />
        <div className="absolute top-1/2 left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-brand-purple/10 to-transparent blur-[0.5px]" />
      </div>

      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-purple via-brand-pink to-brand-light z-[110] origin-[0%]"
        style={{ scaleX: scrollYProgress }}
      />
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
            <Route
              path="/login"
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              }
            />
            <Route
              path="/register"
              element={
                <PageTransition>
                  <Register />
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
