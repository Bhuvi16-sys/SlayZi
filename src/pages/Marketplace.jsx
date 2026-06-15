import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import agentsData from "../data/agents.json";

function AgentIcon({ name, className = "h-6 w-6" }) {
  const IconComponent = Icons[name] || Icons.Bot;
  return <IconComponent className={className} />;
}

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);

  const categories = ["All", "Sales", "Marketing", "Support", "Education", "Custom"];

  // Filter agents based on search text and category select
  const filteredAgents = agentsData.filter((agent) => {
    const matchesCategory =
      selectedCategory === "All" ||
      agent.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.integrations.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
      agent.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] glow-purple-blur opacity-30 pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-0 w-[350px] h-[350px] glow-pink-blur opacity-20 pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-left mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider mb-3">
            <Icons.ShoppingBag className="h-3.5 w-3.5" />
            AI Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-3">
            Deploy Instantly Configured Agents
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Choose from our pre-trained business agent modules, customize integrations in under 5 minutes, and deploy them directly onto your corporate tech stack.
          </p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="relative z-10 flex flex-col md:flex-row gap-6 mb-10 items-stretch">
        
        {/* Search Input Box */}
        <div className="relative flex-grow">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search agents by capability, name, or integration (e.g. WhatsApp, HubSpot)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-[#0F0F1A]/80 border border-white/5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple transition-all duration-300 glass-panel"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white rounded-full transition-colors"
            >
              <Icons.X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap md:flex-nowrap gap-2 bg-white/5 border border-white/5 p-1.5 rounded-xl items-center scrollbar-none overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-display whitespace-nowrap transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-brand-purple text-white shadow-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Count Info */}
      <div className="text-left mb-6 text-xs text-slate-500 font-medium tracking-wide">
        Showing {filteredAgents.length} AI agent{filteredAgents.length !== 1 && "s"} based on filters
      </div>

      {/* Filterable Grid of Cards */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredAgents.map((agent) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={agent.id}
              className="gradient-border-wrap flex flex-col p-6 h-full text-left bg-gradient-to-br from-[#0F0F1A] to-[#0A0A0F] shadow-lg group cursor-pointer"
              onClick={() => setSelectedAgent(agent)}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-brand-purple/10 text-brand-light rounded-lg border border-brand-purple/20 group-hover:bg-brand-purple/20 group-hover:border-brand-purple/40 transition-all duration-300">
                  <AgentIcon name={agent.icon} className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold tracking-widest bg-brand-violet/40 text-brand-light px-2 py-0.5 rounded border border-brand-purple/20 uppercase">
                  {agent.category}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 font-display">{agent.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{agent.description}</p>

              {/* Integrations Chips */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {agent.integrations.slice(0, 3).map((item, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/5 border border-white/5 text-[10px] text-slate-400 rounded"
                  >
                    {item}
                  </span>
                ))}
                {agent.integrations.length > 3 && (
                  <span className="px-2 py-1 bg-white/5 border border-white/5 text-[10px] text-brand-light rounded">
                    +{agent.integrations.length - 3} more
                  </span>
                )}
              </div>

              {/* Key Stat / highlight */}
              <div className="bg-white/5 border border-white/5 rounded-lg p-3 mb-6 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Benchmark Metric</span>
                <span className="text-xs font-bold text-brand-light">{agent.stats}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block leading-none mb-1">Pricing</span>
                  <span className="text-sm font-bold text-white">{agent.price}</span>
                </div>
                <button
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-brand-purple text-white text-xs font-semibold border border-white/10 hover:border-brand-purple transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAgent(agent);
                  }}
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredAgents.length === 0 && (
        <div className="text-center py-20 relative z-10 glass-panel border border-white/5 rounded-2xl max-w-lg mx-auto">
          <Icons.Inbox className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2 font-display">No Agents Found</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
            We couldn't find any agent matching your criteria. Try adjusting your query or category filters, or request a custom automation flow.
          </p>
          <Link to="/custom">
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-xs font-bold text-white shadow-glow">
              Request Custom Agent Build
            </button>
          </Link>
        </div>
      )}

      {/* Agent Detail Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm"
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
                className="absolute top-4 right-4 p-2 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
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
                    <Link to={`/custom?agent=${selectedAgent.id}`} onClick={() => setSelectedAgent(null)}>
                      <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink text-white text-xs font-bold shadow-glow hover:shadow-glow-strong">
                        Get This Agent
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
