import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, FileText, CheckCircle2, User, Mail, Building, Briefcase, Zap, DollarSign } from "lucide-react";
import agentsData from "../data/agents.json";

export default function CustomBuild() {
  const [searchParams] = useSearchParams();
  const agentParam = searchParams.get("agent");

  // Form states
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [automationDetails, setAutomationDetails] = useState("");
  const [budget, setBudget] = useState("growth"); // starter, growth, enterprise
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Focus states for floating labels
  const [focusedInput, setFocusedInput] = useState("");

  // Pre-fill agent from URL search param
  useEffect(() => {
    if (agentParam) {
      const matched = agentsData.find((a) => a.id === agentParam);
      if (matched) {
        setSelectedAgent(matched.name);
        setAutomationDetails(`I'm interested in deploying the ${matched.name}. Specifically, we need it to: `);
      }
    }
  }, [agentParam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API request
    setSubmitted(true);
  };

  const processPhases = [
    {
      step: "01",
      title: "Discovery & Scope",
      description: "We host a 30-minute deep dive to understand your current systems, files, and where friction lies in your daily operations.",
    },
    {
      step: "02",
      title: "Blueprint Design",
      description: "Slayzi maps a logical multi-agent node architecture, outlining API endpoints, integrations, LLMs, and exact budget parameters.",
    },
    {
      step: "03",
      title: "Sandbox Construction",
      description: "We configure the agents, connect integrations (n8n, Supabase, WhatsApp, etc.), and perform rigorous scenario trials.",
    },
    {
      step: "04",
      title: "Deployment & Scale",
      description: "We push the agents live to your stack. Includes 30 days of active oversight, optimization updates, and staff onboarding.",
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto relative overflow-hidden text-left">
      {/* Background ambient glows */}
      <div className="absolute top-1/3 left-0 w-[450px] h-[450px] glow-purple-blur opacity-35 pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] glow-pink-blur opacity-25 pointer-events-none rounded-full" />

      {/* Title */}
      <div className="mb-16 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider mb-3">
          <Zap className="h-3.5 w-3.5" />
          Tailored System Development
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-3">
          Scope Your Automation Blueprint
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Need a fully custom AI setup? Answer a few questions about your processes, and our solution engineers will outline a deployment roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* Left Side: Process Panel */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 glow-purple-blur opacity-20 rounded-full" />
            
            <h3 className="text-xl font-bold text-white mb-6 font-display flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-light" />
              Custom Build Process
            </h3>

            <div className="flex flex-col gap-6 relative">
              {/* Timeline line */}
              <div className="absolute left-[17px] top-4 bottom-4 w-[1px] bg-brand-purple/30" />

              {processPhases.map((phase) => (
                <div key={phase.step} className="flex gap-4 relative">
                  <div className="w-9 h-9 rounded-full bg-[#16122C] border border-brand-purple/40 text-brand-light flex items-center justify-center font-display text-xs font-bold shrink-0 shadow-glow">
                    {phase.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1.5 font-display">{phase.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Note badge */}
            <div className="mt-8 pt-6 border-t border-white/5 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>We respect intellectual property. All custom builds operate under strict NDAs, with option for code ownership escrow.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-8 sm:p-10 rounded-2xl border border-white/5 relative"
              >
                <h3 className="text-xl font-bold text-white mb-6 font-display">Automation Specifications</h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  
                  {/* Contact Info (Grouped) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="relative">
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
                    <div className="relative">
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
                  </div>

                  {/* Business Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <div className="relative">
                      <label className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wider">Company Name</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-[#07070F] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple focus:shadow-glow transition-all"
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>

                    {/* Industry */}
                    <div className="relative">
                      <label className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wider">Industry Type</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-[#07070F] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple focus:shadow-glow transition-all"
                          placeholder="E-commerce / SaaS / Healthcare"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Optional Agent Template Select */}
                  <div className="relative">
                    <label className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wider">Base Agent Template (Optional)</label>
                    <select
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      className="w-full px-4 py-3 bg-[#07070F] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple focus:shadow-glow transition-all"
                    >
                      <option value="">None - Custom Blueprint</option>
                      {agentsData.map((a) => (
                        <option key={a.id} value={a.name}>
                          {a.name} ({a.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Automation Details */}
                  <div className="relative">
                    <label className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wider">What workflows should we automate?</label>
                    <textarea
                      required
                      rows={4}
                      value={automationDetails}
                      onChange={(e) => setAutomationDetails(e.target.value)}
                      className="w-full px-4 py-3 bg-[#07070F] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple focus:shadow-glow transition-all resize-none"
                      placeholder="Explain your daily repetitive tasks. E.g., 'Every day, we manually download client CSVs from Gmail, qualify their emails in Hubspot, and trigger notifications to Slack...'"
                    />
                  </div>

                  {/* Budget Selector */}
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-3 block uppercase tracking-wider">Estimated Budget Range</label>
                    <div className="grid grid-cols-3 gap-4">
                      {/* Budget 1 */}
                      <button
                        type="button"
                        onClick={() => setBudget("starter")}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          budget === "starter"
                            ? "bg-brand-purple/10 border-brand-purple text-white shadow-glow"
                            : "bg-[#07070F] border-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="text-xs font-bold font-display uppercase mb-1">Starter</div>
                        <div className="text-[10px] text-slate-500 font-semibold">$2k - $5k</div>
                      </button>

                      {/* Budget 2 */}
                      <button
                        type="button"
                        onClick={() => setBudget("growth")}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          budget === "growth"
                            ? "bg-brand-purple/10 border-brand-purple text-white shadow-glow"
                            : "bg-[#07070F] border-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="text-xs font-bold font-display uppercase mb-1">Growth</div>
                        <div className="text-[10px] text-slate-500 font-semibold">$5k - $15k</div>
                      </button>

                      {/* Budget 3 */}
                      <button
                        type="button"
                        onClick={() => setBudget("enterprise")}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          budget === "enterprise"
                            ? "bg-brand-purple/10 border-brand-purple text-white shadow-glow"
                            : "bg-[#07070F] border-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="text-xs font-bold font-display uppercase mb-1">Scale</div>
                        <div className="text-[10px] text-slate-500 font-semibold">$15k+</div>
                      </button>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-strong transition-all mt-4 cursor-pointer"
                  >
                    Submit Blueprint Proposal
                    <Send className="h-4 w-4" />
                  </button>

                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="glass-panel p-8 sm:p-12 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center relative overflow-hidden"
              >
                {/* Background light glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 glow-purple-blur opacity-30 rounded-full" />
                
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 shadow-glow relative z-10">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 font-display relative z-10">Blueprint Proposal Submitted</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto mb-8 leading-relaxed relative z-10">
                  Thank you, <span className="text-brand-light font-bold">{fullName}</span>. We have logged your request. Our system architects are drafting a custom flow matching your specifications. You will receive an initial proposal copy in your email <span className="text-white font-semibold">{email}</span> within 24 hours.
                </p>

                <div className="flex gap-4 relative z-10">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFullName("");
                      setEmail("");
                      setBusinessName("");
                      setBusinessType("");
                      setAutomationDetails("");
                    }}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
