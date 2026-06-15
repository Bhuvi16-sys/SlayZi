import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import * as Icons from "lucide-react";
import Tilt from "react-parallax-tilt";
import { MagneticButton } from "../components/MagneticButton";
import AnimatedCounter from "../components/AnimatedCounter";
import agentsData from "../data/agents.json";
import Logo, { LogoIcon } from "../components/Logo";
import FlowingMenu from "../components/FlowingMenu";
import HeroParticles from "../components/HeroParticles";
import TypewriterText from "../components/TypewriterText";
import TextPressure from "../components/TextPressure";
import ShinyText from "../components/ShinyText";
import RobotStack from "../components/RobotStack";

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
  const [activeTab, setActiveTab] = useState("lead-gen");
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [billingPeriod, setBillingPeriod] = useState("monthly"); // monthly or yearly
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState("");

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

  // Demo responses configuration
  const demoChats = {
    "lead-gen": [
      { sender: "user", text: "Find decision-makers in Boston-based clean tech startups." },
      { sender: "agent", text: "Accessing database... 🌐 Scraped 42 targets. Filtered for Series A+ funding. Found 12 CTO profiles. Drafting personalized outbound..." },
      { sender: "agent", text: "Outreach scheduled via Gmail API: 'Hi [Name], loved your recent post on grid stability. We built a solution to...' Auto-logged to HubSpot. 🚀" }
    ],
    "whatsapp-support": [
      { sender: "user", text: "Can I return order #8841? It's too small." },
      { sender: "agent", text: "Retrieving order #8841 from Supabase. You purchased the 'Core-Sleeve Jacket (M - Slate)'. I see it was delivered 3 days ago, which is within the 30-day window." },
      { sender: "agent", text: "I've generated a shipping label and emailed it to you. I also reserved a Large size in our warehouse. Would you like me to ship the replacement once the return is scanned?" }
    ],
    "doubt-solving-tutor": [
      { sender: "user", text: "Why is the sky blue? Explain like I'm 10." },
      { sender: "agent", text: "Imagine sunlight is like a bag of colorful Skittles! 🌈 Red, yellow, blue, etc. When this light hits the atmosphere, gases scatter them." },
      { sender: "agent", text: "Blue light waves are tiny and energetic, so they crash into particles and bounce everywhere! This is called Rayleigh scattering. That's why we see blue when we look up. Ready for a quick quiz?" }
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
      setChatMessages((prev) => [...prev, { sender: "agent", text: "Sorry, I encountered an error communicating with the server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Setup initial chat message
  useEffect(() => {
    setChatMessages([{ sender: "agent", text: "Hello! I am connected to the n8n agent. Type a message below to test the integration." }]);
    setIsTyping(false);
  }, [activeTab]);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
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

  const wordRevealVariants = {
    hidden: { y: "100%" },
    visible: (i) => ({
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    })
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Founder, EduSphere",
      quote: "The Homework Checker Agent saved our tutors over 25 hours a week. Accuracy is incredible, and the students love the instant, high-quality feedback.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Marcus Chen",
      role: "Head of Sales, CloudScale",
      quote: "Slayzi's Lead Generation Agent qualifies and maps prospect profiles on autopilot. Our outbound campaign booking rate increased by 240%. It literally works while we sleep.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Alina Petrova",
      role: "Operations Director, Apex Retail",
      quote: "Our WhatsApp Support Agent resolves 84% of customer tickets without human intervention. The integration with Shopify and Supabase took less than an hour.",
      rating: 5,
      avatar: "AP"
    }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: "Starter",
      description: "Perfect for solopreneurs seeking simple automations.",
      monthlyPrice: "$99",
      yearlyPrice: "$79",
      features: [
        "1 Pre-built AI Agent active",
        "1,000 runs/queries per month",
        "Standard integrations (Email, GSheets)",
        "Discord support queue",
        "Self-service dashboard"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Growth",
      description: "For scaling businesses wanting multi-agent systems.",
      monthlyPrice: "$299",
      yearlyPrice: "$239",
      features: [
        "Up to 4 AI Agents active",
        "10,000 runs/queries per month",
        "Advanced integrations (WhatsApp, n8n, Stripe)",
        "Priority Slack support channel",
        "Custom analytics reporting tool",
        "Webhooks and database syncing"
      ],
      cta: "Start Scaling",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For organizations demanding tailored operations.",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      features: [
        "Unlimited custom built agents",
        "Dedicated isolated agent hosting",
        "SLA guaranteed response time",
        "Custom API integrations & local LLMs",
        "Dedicated solutions engineer",
        "Security & compliance review"
      ],
      cta: "Book Custom Build",
      popular: false
    }
  ];

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative min-h-screen pt-20 overflow-hidden">
      
      {/* 1. HERO SECTION WITH FLOATING ORBS & GRID */}
      <section className="relative min-h-[90vh] flex items-center py-20 px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Animated Background Mesh Orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] glow-purple-blur rounded-full opacity-60 animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] glow-pink-blur rounded-full opacity-40 animate-pulse-glow" style={{ animationDelay: "-3s" }} />
          <div className="absolute top-1/3 right-10 w-[200px] h-[200px] bg-gradient-to-tr from-brand-violet/20 to-brand-purple/10 blur-[80px] rounded-full" />
        </div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 grid-overlay z-0 pointer-events-none opacity-60" />
        
        {/* Hero Particles */}
        <HeroParticles />
        
        {/* Diagonal Scanning Beam */}
        <div className="absolute top-[-50%] left-[-50%] w-[10vw] h-[200vh] bg-gradient-to-r from-transparent via-[#7c3aed]/40 to-transparent blur-[40px] pointer-events-none" style={{ transformOrigin: 'center', animation: 'scanBeam 6s linear infinite' }} />

        <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center self-start gap-2 px-3 py-1.5 rounded-full bg-brand-violet/30 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider"
            >
              <Icons.Cpu className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "3s" }} />
              Ready to Automate
            </motion.div>

            {/* Title Staggered Reveal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-tight tracking-tight text-white relative z-20">
              Deploy AI Agents <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-light">
                <TypewriterText phrases={["That Work While You Sleep", "That Scale With Your Business", "That Automate Your Workflows"]} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed relative z-20"
            >
              Stop wasting hours on manual CRM entries, customer tickets, outreach emails, and repetitive tasks. Deploy smart, specialized AI agents that integrate directly into your stack.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-4 mt-4"
            >
              <Link to="/agents">
                <MagneticButton className="px-7 py-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold shadow-glow hover:shadow-glow-strong flex items-center gap-2 group border border-white/10">
                  Browse Pre-built Agents
                  <Icons.ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </MagneticButton>
              </Link>
              
              <Link to="/custom">
                <button className="px-7 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 transition-colors flex items-center gap-2">
                  Book Custom Build
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual: Robot Stack */}
          <div className="lg:col-span-5 flex justify-center items-center relative h-[350px] lg:h-[450px]">
            <RobotStack />
          </div>
        </div>
      </section>

      {/* 2. TRUSTED-BY / STATS BAR */}
      <section className="relative z-10 border-y border-white/5 bg-[#09090F]/80 backdrop-blur-sm py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center gap-8 md:gap-4">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-light mb-1">
              <AnimatedCounter value="50" suffix="+" />
            </div>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">AI Agents Deployed</p>
          </div>
          <div className="h-px w-12 md:h-12 md:w-px bg-white/10" />
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-light mb-1">
              <AnimatedCounter value="10,000" suffix="+" />
            </div>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">Hours Saved Annually</p>
          </div>
          <div className="h-px w-12 md:h-12 md:w-px bg-white/10" />
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-light mb-1">
              <AnimatedCounter value="24" suffix="/7" />
            </div>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">Continuous Automation</p>
          </div>
        </div>
      </section>

      {/* 3. WHAT IS SLAYZI */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        {/* Morphing blob background */}
        <div className="absolute top-1/4 left-10 w-[40vw] h-[40vw] bg-gradient-to-r from-brand-violet to-brand-pink opacity-[0.08] blur-[80px] animate-blob-morph pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[30vw] h-[30vw] bg-gradient-to-l from-brand-purple to-brand-light opacity-[0.1] blur-[80px] animate-blob-morph pointer-events-none" style={{ animationDelay: '-5s' }} />

        <div className="text-center flex flex-col items-center gap-4 mb-16 relative z-10">
          <div className="px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider">
            Key Solutions
          </div>
          <div className="w-full max-w-4xl h-32 relative">
            <TextPressure
              text="Supercharge Operations with End-To-End Automation"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#ff0000"
              minFontSize={24}
            />
          </div>
          <p className="text-slate-400 text-base max-w-xl">
            We provide modular capabilities designed to sit alongside your team and execute complex tasks immediately.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glarePosition="all" glareBorderRadius="1rem" className="h-full">
            <motion.div
              variants={itemVariants}
              className="glass-panel p-8 rounded-2xl relative overflow-hidden group border border-white/5 shadow-lg h-full"
            >
            <div className="absolute top-0 right-0 w-32 h-32 glow-purple-blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
            <div className="p-4 bg-brand-purple/10 text-brand-light rounded-xl w-14 h-14 flex items-center justify-center border border-brand-purple/20 mb-6 group-hover:bg-brand-purple/20 transition-all duration-300">
              <Icons.Layers className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-display">Pre-built Agents</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Browse our marketplace of plug-and-play AI agents. From lead gen to customer support, pick the exact agent you need and deploy in minutes.
            </p>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-300 mb-6 border-t border-white/5 pt-4">
              <li className="flex items-center gap-2"><Icons.CheckCircle2 className="h-4 w-4 text-brand-light" /> Ready-to-go templates</li>
              <li className="flex items-center gap-2"><Icons.CheckCircle2 className="h-4 w-4 text-brand-light" /> Fully modular settings</li>
            </ul>
            <Link to="/agents" className="text-xs font-semibold text-brand-light hover:text-white flex items-center gap-1.5 transition-colors group/link">
              Explore marketplace
              <Icons.ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
            </Link>
            </motion.div>
          </Tilt>

          {/* Card 2 */}
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glarePosition="all" glareBorderRadius="1rem" className="h-full">
            <motion.div
              variants={itemVariants}
              className="glass-panel p-8 rounded-2xl relative overflow-hidden group border border-white/5 shadow-lg h-full"
            >
            <div className="absolute top-0 right-0 w-32 h-32 glow-purple-blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
            <div className="p-4 bg-brand-purple/10 text-brand-light rounded-xl w-14 h-14 flex items-center justify-center border border-brand-purple/20 mb-6 group-hover:bg-brand-purple/20 transition-all duration-300">
              <Icons.GitMerge className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-display">Custom CRMs</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Need agents mapped to unique legacy software? We specialize in building tailored AI hubs synced with your CRM pipelines and dashboards.
            </p>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-300 mb-6 border-t border-white/5 pt-4">
              <li className="flex items-center gap-2"><Icons.CheckCircle2 className="h-4 w-4 text-brand-light" /> Syncs with HubSpot & Salesforce</li>
              <li className="flex items-center gap-2"><Icons.CheckCircle2 className="h-4 w-4 text-brand-light" /> Custom dashboard overlays</li>
            </ul>
            <Link to="/custom" className="text-xs font-semibold text-brand-light hover:text-white flex items-center gap-1.5 transition-colors group/link">
              Build custom CRM
              <Icons.ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
            </Link>
            </motion.div>
          </Tilt>

          {/* Card 3 */}
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glarePosition="all" glareBorderRadius="1rem" className="h-full">
            <motion.div
              variants={itemVariants}
              className="glass-panel p-8 rounded-2xl relative overflow-hidden group border border-white/5 shadow-lg h-full"
            >
            <div className="absolute top-0 right-0 w-32 h-32 glow-purple-blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
            <div className="p-4 bg-brand-purple/10 text-brand-light rounded-xl w-14 h-14 flex items-center justify-center border border-brand-purple/20 mb-6 group-hover:bg-brand-purple/20 transition-all duration-300">
              <Icons.Zap className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-display">End-to-End Automation</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Connect multiple agents to construct complex workflows. Watch information route seamlessly from raw leads to final invoices with absolute security.
            </p>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-300 mb-6 border-t border-white/5 pt-4">
              <li className="flex items-center gap-2"><Icons.CheckCircle2 className="h-4 w-4 text-brand-light" /> Automated multi-agent handoffs</li>
              <li className="flex items-center gap-2"><Icons.CheckCircle2 className="h-4 w-4 text-brand-light" /> Continuous optimization loops</li>
            </ul>
            <a href="#demo" className="text-xs font-semibold text-brand-light hover:text-white flex items-center gap-1.5 transition-colors group/link">
              See it in action
              <Icons.ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
            </a>
            </motion.div>
          </Tilt>
        </motion.div>
      </section>

      {/* 4. AGENT SHOWCASE */}
      <section className="relative py-24 px-6 bg-[#08080C] border-y border-white/5 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <div className="px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider">
              Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white max-w-2xl leading-tight">
              Meet Our Featured AI Agents
            </h2>
            <p className="text-slate-400 text-base max-w-xl">
              Explore a few of our popular pre-configured autonomous agents.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
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
              {filteredAgents.slice(0, 6).map((agent) => (
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
                  {/* Spotlight Pseudo-element via inline style inside card */}
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

                  {/* Key Stat / highlight with Progress Bar */}
                  <div className="bg-white/5 border border-white/5 rounded-lg p-3 mb-6 relative z-10 overflow-hidden group/stat">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500">Key Metric</span>
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
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-sm font-bold text-white">{agent.price}</span>
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
            <Link to="/agents">
              <MagneticButton className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 shadow-lg flex items-center gap-2 mx-auto group">
                Browse All Marketplace Agents
                <Icons.ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS - TIMELINE */}
      <section className="relative py-24 px-6 max-w-5xl mx-auto z-10">
        <div className="text-center flex flex-col items-center gap-4 mb-20">
          <div className="px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider">
            Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white max-w-2xl leading-tight">
            How We Get You Automated
          </h2>
          <p className="text-slate-400 text-base max-w-xl">
            From your first blueprint proposal to full scale deployment.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="relative">
          {/* Vertical spine line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-brand-purple via-brand-pink to-brand-light opacity-30 transform -translate-x-1/2" />

          {/* Step 1 */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
            <div className="sm:text-right flex flex-col items-start sm:items-end justify-center pl-10 sm:pl-0 sm:pr-12">
              <div className="text-xs font-bold text-brand-light uppercase tracking-wider mb-2">Step 1</div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Pick or Request</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Select from our filterable list of pre-built models or describe what task you want automated via our custom build portal.
              </p>
            </div>
            {/* Dot indicator */}
            <div className="absolute left-4 sm:left-1/2 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink p-0.5 border border-black z-20 flex items-center justify-center text-xs font-bold text-white shadow-glow">
              1
            </div>
            <div className="hidden sm:block" />
          </div>

          {/* Step 2 */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
            <div className="hidden sm:block" />
            {/* Dot indicator */}
            <div className="absolute left-4 sm:left-1/2 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink p-0.5 border border-black z-20 flex items-center justify-center text-xs font-bold text-white shadow-glow">
              2
            </div>
            <div className="flex flex-col items-start justify-center pl-10 sm:pl-12">
              <div className="text-xs font-bold text-brand-light uppercase tracking-wider mb-2">Step 2</div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">We Build & Configure</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Our solutions team maps the AI model, installs state hooks, injects your documents/prompts, and establishes your rules.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
            <div className="sm:text-right flex flex-col items-start sm:items-end justify-center pl-10 sm:pl-0 sm:pr-12">
              <div className="text-xs font-bold text-brand-light uppercase tracking-wider mb-2">Step 3</div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Deploy on Your Stack</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Link the agent directly inside tools like WhatsApp, HubSpot, Zendesk, n8n databases, or your local server through Webhooks and SDKs.
              </p>
            </div>
            {/* Dot indicator */}
            <div className="absolute left-4 sm:left-1/2 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink p-0.5 border border-black z-20 flex items-center justify-center text-xs font-bold text-white shadow-glow">
              3
            </div>
            <div className="hidden sm:block" />
          </div>

          {/* Step 4 */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="hidden sm:block" />
            {/* Dot indicator */}
            <div className="absolute left-4 sm:left-1/2 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink p-0.5 border border-black z-20 flex items-center justify-center text-xs font-bold text-white shadow-glow animate-pulse">
              4
            </div>
            <div className="flex flex-col items-start justify-center pl-10 sm:pl-12">
              <div className="text-xs font-bold text-brand-light uppercase tracking-wider mb-2">Step 4</div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">It Runs 24/7</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Watch detailed logs of completed runs, audits, and performance stats on your dashboard. Enjoy autonomous execution while your team focuses on growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LIVE DEMO SECTION */}
      <section id="demo" className="relative py-24 px-6 bg-[#07070B] border-y border-white/5 z-10 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-purple-blur opacity-30 pointer-events-none rounded-full" />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Demo Copy */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left relative z-10">
            <div className="px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider self-start">
              Interactive Test Drive
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
              Watch an AI Agent Execute in Real-Time
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Select an agent simulation below to see how Slayzi agents interpret instructions, make calls to tools (databases, email providers, CRMs), and respond to workflows autonomously.
            </p>

            {/* Sim Buttons */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={() => setActiveTab("lead-gen")}
                className={`flex items-center gap-3 p-4 rounded-xl text-left border transition-all ${
                  activeTab === "lead-gen"
                    ? "bg-brand-purple/10 border-brand-purple text-white shadow-glow"
                    : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <Icons.Users className="h-5 w-5" />
                <div>
                  <div className="text-sm font-bold font-display">Lead Gen Outbound Flow</div>
                  <div className="text-xs text-slate-400">Scrapes profiles & schedules personalized emails</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("whatsapp-support")}
                className={`flex items-center gap-3 p-4 rounded-xl text-left border transition-all ${
                  activeTab === "whatsapp-support"
                    ? "bg-brand-purple/10 border-brand-purple text-white shadow-glow"
                    : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <Icons.MessageSquare className="h-5 w-5" />
                <div>
                  <div className="text-sm font-bold font-display">WhatsApp Support Flow</div>
                  <div className="text-xs text-slate-400">Resolves queries & executes shop refunds</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("doubt-solving-tutor")}
                className={`flex items-center gap-3 p-4 rounded-xl text-left border transition-all ${
                  activeTab === "doubt-solving-tutor"
                    ? "bg-brand-purple/10 border-brand-purple text-white shadow-glow"
                    : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <Icons.GraduationCap className="h-5 w-5" />
                <div>
                  <div className="text-sm font-bold font-display">Doubt-Solving Tutor Flow</div>
                  <div className="text-xs text-slate-400">Guides students using the Socratic method</div>
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
                    {activeTab === "lead-gen"
                      ? "Lead_Gen_Bot_Active"
                      : activeTab === "whatsapp-support"
                      ? "WhatsApp_Support_Bot_Active"
                      : "Doubt_Tutor_Bot_Active"}
                  </h4>
                  <span className="text-[10px] text-slate-400">Status: Listening to inputs</span>
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
                      {msg.sender === "user" ? "Client Input" : "Agent Response"}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
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
                      Agent Thinking
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
                  placeholder="Type your message..."
                  className="bg-transparent w-full focus:outline-none text-white placeholder:text-slate-600"
                />
                <Icons.Terminal className="h-4 w-4 ml-2" />
              </div>
              <button type="submit" disabled={isTyping || !inputText.trim()} className="p-2.5 bg-brand-purple/20 text-brand-light border border-brand-purple/30 rounded-lg hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Icons.Play className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS CAROUSEL */}
      <section className="relative py-24 px-6 max-w-5xl mx-auto z-10">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <div className="px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider">
            Client Success
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white max-w-2xl leading-tight">
            Loved By Growing Operations
          </h2>
        </div>

        <div className="relative">
          {/* Testimonial Display */}
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 relative overflow-hidden min-h-[280px] flex flex-col justify-between">
            {/* Giant quote mark decoration */}
            <Icons.Quote className="absolute top-6 right-8 h-20 w-20 text-white/5 rotate-180 pointer-events-none" />

            <div className="flex flex-col gap-6">
              {/* Rating */}
              <div className="flex gap-1">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Icons.Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white text-base sm:text-lg italic leading-relaxed relative z-10">
                "{testimonials[activeTestimonial].quote}"
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 border-t border-white/10 pt-6 mt-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink text-white flex items-center justify-center font-bold text-sm shadow-glow font-display">
                {testimonials[activeTestimonial].avatar}
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">{testimonials[activeTestimonial].name}</h4>
                <p className="text-xs text-slate-400">{testimonials[activeTestimonial].role}</p>
              </div>
            </div>
          </div>

          {/* Carousel Nav buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handlePrevTestimonial}
              className="p-3 bg-white/5 border border-white/5 text-slate-300 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <Icons.ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextTestimonial}
              className="p-3 bg-white/5 border border-white/5 text-slate-300 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <Icons.ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. PRICING SECTION */}
      <section className="relative py-24 px-6 bg-[#08080C] border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <div className="px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider">
              Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white max-w-2xl leading-tight">
              Flexible Plans Built for Growth
            </h2>
            
            {/* Toggle Billing switch */}
            <div className="flex items-center gap-3 mt-6 bg-white/5 border border-white/5 rounded-full p-1.5 w-64 mx-auto relative z-10">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold font-display transition-all ${
                  billingPeriod === "monthly" ? "bg-brand-purple text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold font-display transition-all ${
                  billingPeriod === "yearly" ? "bg-brand-purple text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Yearly (20% off)
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name}
                className={`glass-panel p-8 rounded-2xl flex flex-col justify-between border relative ${
                  plan.popular
                    ? "border-brand-purple bg-[#131024]/40 shadow-glow-strong scale-100 md:scale-[1.03] z-10"
                    : "border-white/5"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-purple to-brand-pink text-[10px] font-bold text-white rounded-full uppercase tracking-wider shadow-md">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-display">{plan.name}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">{plan.description}</p>
                  
                  {/* Price display */}
                  <div className="mb-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white font-display">
                      {billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    {plan.monthlyPrice !== "Custom" && (
                      <span className="text-slate-400 text-xs ml-1 font-semibold">/mo</span>
                    )}
                  </div>

                  {/* Features checklist */}
                  <ul className="flex flex-col gap-4 text-left border-t border-white/5 pt-6 mb-8 text-sm text-slate-300">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Icons.Check className="h-4.5 w-4.5 text-brand-light shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to={plan.cta === "Book Custom Build" ? "/custom" : "/custom"} className="block w-full">
                  <button
                    className={`w-full py-3.5 rounded-xl text-center text-sm font-bold transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:scale-102 shadow-glow"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8.5 FLOWING MENU SECTION */}
      <section className="relative py-24 px-0 bg-[#120F17] border-t border-white/5 z-10 overflow-hidden">
        <div className="text-center flex flex-col items-center gap-4 mb-12 px-6">
          <div className="px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider">
            Integrations
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
            Seamless Connections
          </h2>
        </div>
        <div style={{ height: '600px', position: 'relative' }}>
          <FlowingMenu 
            items={[
              { link: '#', text: 'HubSpot', image: 'https://picsum.photos/600/400?random=1' },
              { link: '#', text: 'Salesforce', image: 'https://picsum.photos/600/400?random=2' },
              { link: '#', text: 'Zendesk', image: 'https://picsum.photos/600/400?random=3' },
              { link: '#', text: 'Shopify', image: 'https://picsum.photos/600/400?random=4' }
            ]}
          />
        </div>
      </section>

      {/* 9. BIG Gradient CTA BANNER */}
      <section className="relative py-28 px-6 max-w-7xl mx-auto z-10">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-16 border border-brand-purple/30 text-center flex flex-col items-center justify-center gap-6 shadow-glow-strong">
          
          {/* Banner gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-violet via-[#140C29] to-brand-violet opacity-85 z-0" />
          
          {/* Subtle animated overlay elements */}
          <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-brand-purple/20 blur-[100px] rounded-full animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-brand-pink/20 blur-[100px] rounded-full animate-pulse-glow" style={{ animationDelay: "-4s" }} />
          <div className="absolute inset-0 grid-overlay opacity-30 z-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white max-w-2xl leading-tight">
              <ShinyText 
                text="Ready to Automate Your Business?" 
                speed={3} 
                delay={1} 
                color="#ffffff" 
                shineColor="#a855f7" 
                spread={100} 
                direction="left"
              />
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mb-4">
              Join dozens of forward-thinking companies deploying dedicated Slayzi AI workflows to drive down operational costs.
            </p>
            <Link to="/custom">
              <MagneticButton className="px-8 py-4.5 rounded-xl bg-white text-slate-900 font-extrabold text-sm shadow-2xl flex items-center gap-2 group hover:scale-[1.02] transition-transform">
                Get Custom Build Pricing
                <Icons.ArrowRight className="h-4 w-4 text-slate-900 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Agent Detail Modal (Showcase Card Trigger) */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-2xl bg-[#0F0F1A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedAgent(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Icons.X className="h-5 w-5" />
              </button>

              <div className="p-8">
                {/* Header */}
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

                {/* Body */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {selectedAgent.longDescription}
                </p>

                {/* Features List */}
                <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider font-display">Key Capabilities</h4>
                <ul className="flex flex-col gap-3 text-xs text-slate-300 mb-6">
                  {selectedAgent.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <Icons.CheckCircle2 className="h-4.5 w-4.5 text-brand-light shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Integrations */}
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

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Estimated Price</span>
                    <span className="text-lg font-extrabold text-white font-display">{selectedAgent.price}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedAgent(null)}
                      className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10"
                    >
                      Close
                    </button>
                    <Link to="/custom" onClick={() => setSelectedAgent(null)}>
                      <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink text-white text-xs font-bold shadow-glow hover:shadow-glow-strong">
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
