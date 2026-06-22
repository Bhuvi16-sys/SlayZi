import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import Tilt from "react-parallax-tilt";
import { MagneticButton } from "../components/MagneticButton";
import AnimatedCounter from "../components/AnimatedCounter";
import agentsData from "../data/agents.json";
import FlowingMenu from "../components/FlowingMenu";
import HeroParticles from "../components/HeroParticles";
import TypewriterText from "../components/TypewriterText";
import TextPressure from "../components/TextPressure";
import ShinyText from "../components/ShinyText";
import RobotStack from "../components/RobotStack";
import { LogoIcon } from "../components/Logo";

// Dynamic Icon Resolver
function AgentIcon({ name, className = "h-6 w-6" }) {
  const IconComponent = Icons[name] || Icons.Bot;
  return <IconComponent className={className} />;
}

function extractPercentage(stats) {
  const pctMatch = stats.match(/(\d+)%/);
  if (pctMatch) return Math.min(100, parseInt(pctMatch[1], 10));
  const xMatch = stats.match(/([\d.]+)\s*x/i);
  if (xMatch) return Math.min(100, 30 + parseFloat(xMatch[1]) * 10);
  return 75;
}

export default function Landing() {
  const [activeTab, setActiveTab] = useState("admissions");
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState("");

  // Refs for scrolling
  const caseStudyRef = useRef(null);
  const demoRef = useRef(null);

  useEffect(() => {
    let storedSessionId = localStorage.getItem("n8nSessionId");
    if (!storedSessionId) {
      storedSessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("n8nSessionId", storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const categories = ["All", ...new Set(agentsData.map(a => a.category))];
  const filteredAgents = activeCategory === "All" ? agentsData : agentsData.filter(a => a.category === activeCategory);

  // Simulated conversations representing Saraswati Vidyamandir & other Slayzi agents
  const demoChats = {
    admissions: [
      { sender: "user", text: "Hi, I'm looking to enroll my son in Class 10 at Saraswati Vidyamandir. What are the criteria?" },
      { sender: "agent", text: "Hi there! 📚 For Class 10 CBSE enrollment at Saraswati Vidyamandir, we look at the Class 9 report card and require a basic aptitude assessment in Math & Science. Would you like me to schedule a campus visit or send the registration form via WhatsApp?" },
      { sender: "user", text: "Yes, please send the registration form." },
      { sender: "agent", text: "Perfect! I've sent the enrollment link to your number. I also scheduled an automated follow-up for tomorrow. Let me know if you need help with documents! 📝" }
    ],
    tutor: [
      { sender: "user", text: "Can you explain how Rayleigh scattering makes the sky blue? I'm preparing for the CBSE physics exam." },
      { sender: "agent", text: "Absolutely! ☀️ Sunlight contains all colors. When it hits the Earth's atmosphere, the gases scatter the light. Blue light has shorter wavelengths and scatters much more than red light. That's Rayleigh scattering! Ready for a quick practice question?" },
      { sender: "user", text: "Sure, ask me." },
      { sender: "agent", text: "Great! Why does the sun look reddish-orange at sunset if blue scatters more? Think about the distance light travels through the atmosphere. 🌅" }
    ],
    leads: [
      { sender: "user", text: "Is the 3BHK villa at Green Meadows still available? I saw it on your real estate listing." },
      { sender: "agent", text: "Yes, it is! 🏡 Green Meadows Villa #14 is available for listing price $240k. It has 3 bedrooms, an open terrace, and automated solar panels. Would you like me to book a site-visit this Saturday at 11 AM?" },
      { sender: "user", text: "Yes, 11 AM works for me." },
      { sender: "agent", text: "Awesome! I have blocked Saturday at 11 AM for your visit. Our agent Rohini will meet you there. I have pinged you the Google Maps location. 📍" }
    ]
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = { sender: "user", text: inputText };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: newMsg.text,
          userSessionId: sessionId
        }),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setChatMessages((prev) => [...prev, { sender: "agent", text: data.text }]);
    } catch (error) {
      console.error(error);
      // Fallback response simulating local agent response if n8n is not running
      setTimeout(() => {
        setChatMessages((prev) => [...prev, { 
          sender: "agent", 
          text: `[Simulation Mode] I received: "${newMsg.text}". I can qualify this intent, query the knowledge base, and trigger the next step in our database. Link your live n8n node to test in production!` 
        }]);
        setIsTyping(false);
      }, 1000);
      return;
    }
    setIsTyping(false);
  };

  // Setup initial chat message from tab
  useEffect(() => {
    setChatMessages([
      { sender: "agent", text: "Hello! I am one of Slayzi's custom AI agents. Try chatting with me below to test our operation flows." },
      ...demoChats[activeTab]
    ]);
    setIsTyping(false);
  }, [activeTab]);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="relative min-h-screen pt-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center py-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] glow-purple-blur rounded-full opacity-60 animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] glow-pink-blur rounded-full opacity-40 animate-pulse-glow" style={{ animationDelay: "-3s" }} />
          <div className="absolute top-1/3 right-10 w-[200px] h-[200px] bg-gradient-to-tr from-brand-violet/20 to-brand-purple/10 blur-[80px] rounded-full" />
        </div>

        <div className="absolute inset-0 grid-overlay z-0 pointer-events-none opacity-60" />
        <HeroParticles />
        
        <div className="absolute top-[-50%] left-[-50%] w-[10vw] h-[200vh] bg-gradient-to-r from-transparent via-[#7c3aed]/40 to-transparent blur-[40px] pointer-events-none" style={{ transformOrigin: 'center', animation: 'scanBeam 6s linear infinite' }} />

        <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            {/* Consolidated Brand Header Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 15 }}
              className="inline-flex items-center self-start gap-3.5 p-2 pr-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-brand-purple/40 shadow-[0_0_20px_rgba(124,58,237,0.05)] hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-300 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <LogoIcon className="h-9 w-9 rounded-xl bg-white p-0.5 border border-white/15" />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div className="h-6 w-px bg-white/15" />
              <div className="flex flex-col text-left">
                <span className="font-display font-bold text-white text-[11px] tracking-wider uppercase leading-none">
                  Slayzi Core
                </span>
                <span className="text-[8px] text-brand-light font-mono font-semibold uppercase tracking-widest mt-1">
                  Active System
                </span>
              </div>
              <div className="h-6 w-px bg-white/15" />
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-brand-violet/30 border border-brand-purple/20 text-brand-light text-[9px] font-semibold uppercase tracking-wider">
                <Icons.Cpu className="h-3 w-3 animate-spin" style={{ animationDuration: "5s" }} />
                Custom AI Agents
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-tight tracking-tight text-white relative z-20">
              AI Agents That Run Your Business <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-light">
                While You Scale It
              </span>
            </h1>

            <div className="text-brand-light font-display font-semibold text-lg sm:text-xl min-h-[50px] relative z-20">
              <TypewriterText phrases={[
                "We build AI agents that work, so your team doesn't have to.",
                "Automate the busywork. Scale the business.",
                "AI agents, built for your business, not a generic chatbot."
              ]} />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed relative z-20"
            >
              Slayzi builds custom AI agents for businesses that are growing fast but stuck doing repetitive, manual work — answering questions, chasing leads, checking paperwork, every single day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-4 mt-4"
            >
              <button 
                onClick={() => scrollToSection(demoRef)}
                className="px-7 py-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold shadow-glow hover:shadow-glow-strong flex items-center gap-2 group border border-white/10 cursor-pointer"
              >
                Book a Demo
                <Icons.ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => scrollToSection(caseStudyRef)}
                className="px-7 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
              >
                See Case Study
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-5 flex justify-center items-center relative h-[350px] lg:h-[450px]">
            <RobotStack />
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="relative z-10 border-y border-white/5 bg-[#09090F]/80 backdrop-blur-sm py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center gap-8 md:gap-4 text-left md:text-center">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-light mb-1">
              <AnimatedCounter value="80" suffix="%" />
            </div>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">Busywork Automated</p>
          </div>
          <div className="h-px w-12 md:h-12 md:w-px bg-white/10" />
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-light mb-1">
              <AnimatedCounter value="24" suffix="/7" />
            </div>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">Always-On Operations</p>
          </div>
          <div className="h-px w-12 md:h-12 md:w-px bg-white/10" />
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-light mb-1">
              <AnimatedCounter value="100" suffix="%" />
            </div>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">Trained on Your Data</p>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM WE SOLVE */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider self-start">
              The Problem
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white leading-tight">
              Every Growing Business Hits the Same Wall
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              More customers means more repetitive work. That repetitive work means either hiring more people, burning out your staff, or watching things slip through the cracks — slow replies, missed leads, and inconsistent follow-ups.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              You shouldn't spend your scaling capital on manual CRM data entries, copying files, or answering the exact same FAQ email 50 times a day.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="glass-panel p-8 rounded-3xl border border-brand-purple/20 relative overflow-hidden bg-gradient-to-tr from-[#160B29] to-[#0A0A0F] text-left">
              <div className="absolute top-0 right-0 w-32 h-32 glow-purple-blur rounded-full opacity-40 pointer-events-none" />
              <div className="px-3 py-1 rounded-full bg-brand-violet/40 text-brand-light text-[10px] font-bold uppercase tracking-wider self-start inline-block mb-6 border border-brand-purple/20">
                Slayzi Solution
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-display">Removing the Wall</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Slayzi builds dedicated AI agents that handle the repetitive <strong>80% of the work</strong> — instantly, consistently, 24/7 — so your team can focus on the <strong>20% that actually needs a human</strong>.
              </p>
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-3">
                  <Icons.CheckCircle2 className="h-5 w-5 text-brand-light shrink-0" />
                  <span className="text-xs text-slate-200 font-semibold">Trained on your business context & workflows</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icons.CheckCircle2 className="h-5 w-5 text-brand-light shrink-0" />
                  <span className="text-xs text-slate-200 font-semibold">Deployed directly where customers are (WhatsApp, CRM, Web)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icons.CheckCircle2 className="h-5 w-5 text-brand-light shrink-0" />
                  <span className="text-xs text-slate-200 font-semibold">Monitored continuously for optimization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT SLAYZI SELLS (CORE CATEGORIES) */}
      <section className="relative py-24 px-6 bg-[#08080C] border-y border-white/5 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <div className="px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider">
              What We Sell
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white max-w-2xl leading-tight">
              Ready-to-Deploy Custom Modules
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              We sell custom-built AI agents, packaged as ready-to-deploy modules and tailored per business. Explore our core categories:
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeCategory === category
                    ? "bg-brand-purple text-white shadow-glow"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredAgents.map((agent) => (
                <Tilt key={agent.id} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glarePosition="all" className="h-full">
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                      e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                    }}
                    className="gradient-border-wrap flex flex-col p-6 h-full text-left bg-[#0A0A0F] shadow-lg group relative overflow-hidden"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" style={{ background: 'radial-gradient(circle 300px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.15), transparent 80%)' }} />

                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="p-3 bg-brand-purple/10 text-brand-light rounded-lg border border-brand-purple/20 group-hover:bg-brand-purple/20 group-hover:border-brand-purple/40 transition-all duration-300">
                        <AgentIcon name={agent.icon} className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest bg-brand-violet/40 text-brand-light px-2 py-0.5 rounded border border-brand-purple/20 uppercase">
                        {agent.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 font-display relative z-10">{agent.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow relative z-10">{agent.description}</p>

                    <div className="bg-white/5 border border-white/5 rounded-lg p-3 mb-6 relative z-10 overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">Benchmark Metric</span>
                        <span className="text-xs font-bold text-brand-light">{agent.stats}</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${extractPercentage(agent.stats)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-brand-violet to-brand-light rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-slate-300">{agent.price}</span>
                      </div>
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-brand-purple text-white text-xs font-semibold border border-white/10 hover:border-brand-purple transition-all duration-300 flex items-center gap-1 group/btn cursor-pointer"
                      >
                        View Details
                        <Icons.ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                      </button>
                    </div>
                  </motion.div>
                </Tilt>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-12 text-center">
            <Link to="/custom">
              <MagneticButton className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 shadow-lg flex items-center gap-2 mx-auto group">
                Scope a Custom Agent Build
                <Icons.ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="relative py-24 px-6 max-w-5xl mx-auto z-10">
        <div className="text-center flex flex-col items-center gap-4 mb-20">
          <div className="px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider">
            Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white max-w-2xl leading-tight">
            How It Works
          </h2>
          <p className="text-slate-400 text-sm max-w-xl">
            A straightforward path from discovery to permanent, hands-off automation.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-brand-purple via-brand-pink to-brand-light opacity-30 transform -translate-x-1/2" />

          {/* Step 1 */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
            <div className="sm:text-right flex flex-col items-start sm:items-end justify-center pl-10 sm:pl-0 sm:pr-12 text-left">
              <div className="text-xs font-bold text-brand-light uppercase tracking-wider mb-2">Step 1</div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Discover</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                We audit and map your business's repetitive workflows, locating where an AI agent delivers the fastest, highest-impact operations win.
              </p>
            </div>
            <div className="absolute left-4 sm:left-1/2 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink p-0.5 border border-black z-20 flex items-center justify-center text-xs font-bold text-white shadow-glow">
              1
            </div>
            <div className="hidden sm:block" />
          </div>

          {/* Step 2 */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
            <div className="hidden sm:block" />
            <div className="absolute left-4 sm:left-1/2 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink p-0.5 border border-black z-20 flex items-center justify-center text-xs font-bold text-white shadow-glow">
              2
            </div>
            <div className="flex flex-col items-start justify-center pl-10 sm:pl-12 text-left">
              <div className="text-xs font-bold text-brand-light uppercase tracking-wider mb-2">Step 2</div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Build</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                We build and train the agent using your actual data, databases, and processes — not a generic chatbot prompt template.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
            <div className="sm:text-right flex flex-col items-start sm:items-end justify-center pl-10 sm:pl-0 sm:pr-12 text-left">
              <div className="text-xs font-bold text-brand-light uppercase tracking-wider mb-2">Step 3</div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Pilot</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                A free, low-risk pilot period executing on actual daily business workflows, so you can measure real value before committing.
              </p>
            </div>
            <div className="absolute left-4 sm:left-1/2 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink p-0.5 border border-black z-20 flex items-center justify-center text-xs font-bold text-white shadow-glow">
              3
            </div>
            <div className="hidden sm:block" />
          </div>

          {/* Step 4 */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="hidden sm:block" />
            <div className="absolute left-4 sm:left-1/2 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink p-0.5 border border-black z-20 flex items-center justify-center text-xs font-bold text-white shadow-glow animate-pulse">
              4
            </div>
            <div className="flex flex-col items-start justify-center pl-10 sm:pl-12 text-left">
              <div className="text-xs font-bold text-brand-light uppercase tracking-wider mb-2">Step 4</div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Deploy & Scale</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Once proven, the agent goes live permanently on your stack with continuous optimization updates and developer oversight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROOF, NOT PROMISES (CASE STUDY) */}
      <section ref={caseStudyRef} className="relative py-24 px-6 bg-[#06060A] border-y border-white/5 z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-purple-blur opacity-20 pointer-events-none rounded-full" />
        
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          <div className="text-center flex flex-col items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider">
              Flagship Case Study
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
              Proof, Not Promises
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl">
              How we automated student operations for <strong>Saraswati Vidyamandir</strong>, a CBSE coaching institute in Ambala.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left copy */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                From One Automation to a Full AI Operations Layer
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                What began as a single WhatsApp responder grew into a full, live operations layer. Today, our AI agents handle core academic and administrative tasks, running live with zero manual effort from the institute's staff.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <h4 className="text-brand-light text-base font-bold font-display mb-1 flex items-center gap-2">
                    <Icons.MessageSquare className="h-4 w-4" /> Admissions
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Responds to admission inquiries instantly, qualifying intent and capturing numbers day or night.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <h4 className="text-brand-light text-base font-bold font-display mb-1 flex items-center gap-2">
                    <Icons.HelpCircle className="h-4 w-4" /> Doubt-Solving
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Acts as an AI Tutor resolving student academic doubts over WhatsApp via an interactive dialog.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <h4 className="text-brand-light text-base font-bold font-display mb-1 flex items-center gap-2">
                    <Icons.FileCheck className="h-4 w-4" /> Homework grading
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Auto-checks and grades handwriting submissions, providing instant, personalized CBSE feedback.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <h4 className="text-brand-light text-base font-bold font-display mb-1 flex items-center gap-2">
                    <Icons.Video className="h-4 w-4" /> Content generation
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Auto-creates worksheets, exam guides, and extracts short-form marketing videos from lecture logs.
                  </p>
                </div>
              </div>
            </div>

            {/* Right card callout */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-8 rounded-3xl border border-brand-purple/30 relative overflow-hidden bg-gradient-to-br from-[#120B26] via-[#0A0A0F] to-[#0D0D18] text-left">
                <Icons.Quote className="absolute top-4 right-4 h-16 w-16 text-white/5 pointer-events-none" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-light font-display">Client Quote</span>
                <p className="text-white italic text-sm leading-relaxed my-4">
                  "Our staff was spending 4 hours a day answering repeating admissions chats and grading homework. Now, Slayzi agents solve doubt questions and index grades automatically. It's like having four extra operators who never sleep."
                </p>
                <div className="border-t border-white/5 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center font-bold text-white text-xs shadow-glow">
                    SVM
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Saraswati Vidyamandir Staff</div>
                    <div className="text-[10px] text-slate-400">CBSE Coaching Institute, Ambala</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INDUSTRIES WE SERVE */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <div className="px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider">
            Sectors
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
            Industries We Serve
          </h2>
          <p className="text-slate-400 text-sm max-w-xl">
            We target sectors where repetitive customer interaction directly blocks speed-to-lead and service delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-2xl border border-white/5 text-left flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-brand-purple/10 border border-brand-purple/20 text-brand-light rounded-xl flex items-center justify-center mb-6">
                <Icons.GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 font-display">Education & Coaching</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Automate admissions intakes, student doubt-solving, grading workflows, and localized practice test creations.
              </p>
            </div>
            <span className="text-[10px] text-brand-light font-bold uppercase tracking-wider">Reference: Ambala Case Study</span>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/5 text-left flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-brand-purple/10 border border-brand-purple/20 text-brand-light rounded-xl flex items-center justify-center mb-6">
                <Icons.Home className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 font-display">Real Estate</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Drive instant response for inbound listing questions, qualify leads on WhatsApp, and schedule site-visits seamlessly.
              </p>
            </div>
            <span className="text-[10px] text-brand-light font-bold uppercase tracking-wider">Speed-To-Lead Driven</span>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/5 text-left flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-brand-purple/10 border border-brand-purple/20 text-brand-light rounded-xl flex items-center justify-center mb-6">
                <Icons.Banknote className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 font-display">Lending & Financial Services</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Deploy compliant, conversational outbound recovery agents and automated reminders via voice or text.
              </p>
            </div>
            <span className="text-[10px] text-brand-light font-bold uppercase tracking-wider">Secure & Compliant Logs</span>
          </div>
        </div>
      </section>

      {/* 8. WHY SLAYZI */}
      <section className="relative py-24 px-6 bg-[#08080C] border-y border-white/5 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <div className="px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider">
              Advantages
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
              Why Slayzi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
              <h3 className="text-base font-bold text-white mb-2 font-display">Built, not templated.</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Every agent is trained directly on your business workflows, database architecture, and customer history. No generic prompt templates.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
              <h3 className="text-base font-bold text-white mb-2 font-display">Proven in production.</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Not just pitched in a pitch deck or shown in slide videos. Our agents handle real CBSE parents and students daily in production.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
              <h3 className="text-base font-bold text-white mb-2 font-display">Founder-led delivery.</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                You get direct access to the software engineers building your operations layer. No sales team or account layers blocking development.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
              <h3 className="text-base font-bold text-white mb-2 font-display">Pilot before you pay.</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                We establish value on real workflows during a free, low-risk pilot period before asking you to commit to any subscription.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INTERACTIVE DEMO & CHAT SIMULATION */}
      <section ref={demoRef} id="demo" className="relative py-24 px-6 z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-purple-blur opacity-30 pointer-events-none rounded-full" />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Demo Copy */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left relative z-10">
            <div className="px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider self-start">
              Interactive Test Drive
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
              Watch Slayzi Work in Real-Time
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Select one of our simulated production flows below to see how our agents receive customer inputs, query knowledge, and trigger tasks.
            </p>

            {/* Sim Buttons */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={() => setActiveTab("admissions")}
                className={`flex items-center gap-3 p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  activeTab === "admissions"
                    ? "bg-brand-purple/10 border-brand-purple text-white shadow-glow"
                    : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <Icons.GraduationCap className="h-5 w-5" />
                <div>
                  <div className="text-sm font-bold font-display">Admissions Agent Flow</div>
                  <div className="text-xs text-slate-400">Qualifies CBSE inquiries & maps visits</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("tutor")}
                className={`flex items-center gap-3 p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  activeTab === "tutor"
                    ? "bg-brand-purple/10 border-brand-purple text-white shadow-glow"
                    : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <Icons.MessageSquare className="h-5 w-5" />
                <div>
                  <div className="text-sm font-bold font-display">WhatsApp AI Tutor Flow</div>
                  <div className="text-xs text-slate-400">Teaches concepts using Socratic questions</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("leads")}
                className={`flex items-center gap-3 p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  activeTab === "leads"
                    ? "bg-brand-purple/10 border-brand-purple text-white shadow-glow"
                    : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <Icons.Users className="h-5 w-5" />
                <div>
                  <div className="text-sm font-bold font-display">Lead & Inquiry Flow</div>
                  <div className="text-xs text-slate-400">Real estate Q&A & visit scheduler</div>
                </div>
              </button>
            </div>
          </div>

          {/* Demo Chat Window */}
          <div className="lg:col-span-7 w-full h-[450px] sm:h-[480px] bg-[#0A0A0F]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden relative">
            {/* Top Bar */}
            <div className="px-6 py-4 border-b border-white/10 bg-[#0E0E16]/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                    {activeTab === "admissions"
                      ? "Admissions_Bot_Active"
                      : activeTab === "tutor"
                      ? "AI_Tutor_Bot_Active"
                      : "Lead_Inquiry_Bot_Active"}
                  </h4>
                  <span className="text-[10px] text-slate-400">Status: Running Live Simulation</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                    }`}
                  >
                    <div className="text-[9px] text-slate-500 mb-1 uppercase tracking-wide">
                      {msg.sender === "user" ? "User / Student" : "Slayzi Agent"}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed text-left ${
                        msg.sender === "user"
                          ? "bg-brand-purple text-white rounded-tr-none"
                          : "bg-white/5 border border-white/5 text-slate-200 rounded-tl-none font-mono text-[12px]"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="self-start flex flex-col items-start max-w-[80%]"
                  >
                    <div className="text-[9px] text-slate-500 mb-1 uppercase tracking-wide">
                      Agent Processing
                    </div>
                    <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                      <span className="h-2 w-2 bg-brand-light rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 bg-brand-light rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 bg-brand-light rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Bottom Input Field */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-white/10 bg-[#0C0C14]/80 flex items-center gap-3">
              <div className="flex-grow text-xs text-slate-500 bg-[#07070C] px-4 py-2.5 rounded-lg border border-white/5 flex items-center justify-between">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a question or request a demo task..."
                  className="bg-transparent w-full focus:outline-none text-white placeholder:text-slate-600"
                />
                <Icons.Terminal className="h-4 w-4 ml-2" />
              </div>
              <button 
                type="submit" 
                disabled={isTyping || !inputText.trim()} 
                className="p-2.5 bg-brand-purple/20 text-brand-light border border-brand-purple/30 rounded-lg hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Icons.Play className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 10. INTEGRATIONS FLOATING BAR */}
      <section className="relative py-24 px-0 bg-[#120F17] border-t border-white/5 z-10 overflow-hidden">
        <div className="text-center flex flex-col items-center gap-4 mb-12 px-6">
          <div className="px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider">
            Integrations
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
            Seamless Stack Connections
          </h2>
        </div>
        <div style={{ height: '600px', position: 'relative' }}>
          <FlowingMenu 
            items={[
              { link: '#', text: 'WhatsApp Business', image: 'https://picsum.photos/600/400?random=1' },
              { link: '#', text: 'HubSpot CRM', image: 'https://picsum.photos/600/400?random=2' },
              { link: '#', text: 'n8n Automation', image: 'https://picsum.photos/600/400?random=3' },
              { link: '#', text: 'Supabase DB', image: 'https://picsum.photos/600/400?random=4' }
            ]}
          />
        </div>
      </section>

      {/* 11. CALL TO ACTION BANNER */}
      <section className="relative py-28 px-6 max-w-7xl mx-auto z-10">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-16 border border-brand-purple/30 text-center flex flex-col items-center justify-center gap-6 shadow-glow-strong">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-violet via-[#140C29] to-brand-violet opacity-85 z-0" />
          <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-brand-purple/20 blur-[100px] rounded-full animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-brand-pink/20 blur-[100px] rounded-full animate-pulse-glow" style={{ animationDelay: "-4s" }} />
          <div className="absolute inset-0 grid-overlay opacity-30 z-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white max-w-2xl leading-tight">
              <ShinyText 
                text="Book a 15-minute Demo" 
                speed={3} 
                delay={1} 
                color="#ffffff" 
                shineColor="#a855f7" 
                spread={100} 
                direction="left"
              />
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mb-4">
              Watch Slayzi work live on a real conversation. No commitment, no cost. Pilot real workflows before you pay.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/custom">
                <button className="px-8 py-4.5 rounded-xl bg-white text-slate-900 font-extrabold text-sm shadow-2xl flex items-center gap-2 group hover:scale-[1.02] transition-transform cursor-pointer">
                  Book a Demo
                  <Icons.ArrowRight className="h-4 w-4 text-slate-900 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                <button className="px-8 py-4.5 rounded-xl bg-emerald-600 text-white font-extrabold text-sm shadow-2xl flex items-center gap-2 group hover:scale-[1.02] transition-transform cursor-pointer border border-emerald-500">
                  <Icons.MessageCircle className="h-4 w-4" />
                  WhatsApp Us
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Detail Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-2xl bg-[#0F0F1A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative text-left"
            >
              <button
                onClick={() => setSelectedAgent(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Icons.X className="h-5 w-5" />
              </button>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3.5 bg-brand-purple/10 text-brand-light rounded-xl border border-brand-purple/20">
                    <AgentIcon name={selectedAgent.icon} className="h-7 w-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-brand-light uppercase border border-brand-purple/20 px-2 py-0.5 rounded bg-brand-violet/20">
                      {selectedAgent.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-display">{selectedAgent.name}</h3>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {selectedAgent.longDescription}
                </p>

                <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider font-display">Key Capabilities</h4>
                <ul className="flex flex-col gap-3 text-xs text-slate-300 mb-6">
                  {selectedAgent.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-left">
                      <Icons.CheckCircle2 className="h-4.5 w-4.5 text-brand-light shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider font-display">Integrations</h4>
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedAgent.integrations.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-white/5 border border-white/5 text-xs text-slate-300 rounded-lg flex items-center gap-1.5"
                    >
                      <Icons.Workflow className="h-3 w-3 text-brand-light" />
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Estimated Price</span>
                    <span className="text-lg font-extrabold text-white font-display">{selectedAgent.price}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedAgent(null)}
                      className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 cursor-pointer"
                    >
                      Close
                    </button>
                    <Link to="/custom" onClick={() => setSelectedAgent(null)}>
                      <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink text-white text-xs font-bold shadow-glow hover:shadow-glow-strong cursor-pointer">
                        Configure This Agent
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
