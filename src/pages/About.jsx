import React from "react";
import { motion } from "framer-motion";
import { Award, Compass, Users, Target, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MagneticButton } from "../components/MagneticButton";

export default function About() {
  const timelineEvents = [
    {
      year: "2024",
      title: "The Genesis",
      description: "Slayzi was founded in San Francisco by a small team of database and AI engineers who grew tired of standard, rigid SaaS APIs. The goal: create fluid, autonomous agent workforces.",
    },
    {
      year: "Early 2025",
      title: "Agent SDK & Custom CRM integration",
      description: "We launched the Slayzi SDK, letting developers code customized agent templates. We deployed our first 15 bespoke CRM systems for early-stage logistics and support tech companies.",
    },
    {
      year: "Late 2025",
      title: "Launch of the AI Marketplace",
      description: "We opened the modular Slayzi Marketplace, allowing non-technical operators to browse, configure, and boot agents instantly. Reached 50+ active client platforms in two months.",
    },
    {
      year: "2026",
      title: "Orchestration & Beyond",
      description: "Released Slayzi Hub, connecting multiple agents together in workflow loops. Now supporting WhatsApp routing, localized LLM configurations, and enterprise SLAs.",
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-5xl mx-auto relative overflow-hidden text-left">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] glow-purple-blur opacity-30 pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] glow-pink-blur opacity-25 pointer-events-none rounded-full" />

      {/* Header */}
      <div className="mb-20 relative z-10 text-center flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-purple/20 text-brand-light text-xs font-semibold uppercase tracking-wider mb-2">
          <Compass className="h-3.5 w-3.5" />
          Our Mission
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white max-w-2xl leading-tight">
          Ready to Automate the Boring Work
        </h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Slayzi was built to bridge the gap between complex artificial intelligence models and daily business tools. We build AI workers that execute tasks, not templates.
        </p>
      </div>

      {/* Core Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative z-10">
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-light flex items-center justify-center mb-5">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 font-display">Hyper-Specialization</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            We don't build generic chat prompts. Our agents do one job—like qualifying a lead or checking grade scores—with extreme accuracy.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-light flex items-center justify-center mb-5">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 font-display">Deep System Integration</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            An agent is only as good as its connections. We build seamless hooks to WhatsApp, Supabase, n8n, Stripe, and legacy corporate CRMs.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-light flex items-center justify-center mb-5">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 font-display">Secure & Compliant</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Data safety is paramount. Slayzi uses end-to-end sandbox routing, isolated runtime containers, and conforms with rigorous compliance guidelines.
          </p>
        </div>
      </div>

      {/* Founder Story */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-24 relative z-10">
        <div className="md:col-span-7">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">The Slayzi Story</h2>
          <div className="flex flex-col gap-4 text-slate-300 text-sm leading-relaxed">
            <p>
              In late 2024, our founders were designing integration architectures for growing enterprise companies. They realized that every company had a mountain of tasks that standard workflows couldn't handle—tasks requiring semantic understanding and contextual choices.
            </p>
            <p>
              The solution wasn't another heavy CRM dashboard or another rigid spreadsheet script. It was a fluid AI agent that could act like an autonomous teammate: picking up tasks, running checks in external tools, replying instantly in natural language, and asking for human validation only when unsure.
            </p>
            <p>
              We founded Slayzi to make AI agents accessible to every operator. We handle the model hosting, logic orchestration, security containment, and api hooks, leaving you with one dashboard showing tasks solved.
            </p>
          </div>
        </div>
        
        {/* Story Visual Side Card */}
        <div className="md:col-span-5">
          <div className="glass-panel p-8 rounded-2xl border border-brand-purple/30 relative overflow-hidden bg-gradient-to-tr from-[#140D2B] via-[#0A0A0F] to-[#0D0D18]">
            <div className="absolute -top-10 -right-10 w-32 h-32 glow-purple-blur rounded-full opacity-40 pointer-events-none" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-light font-display">Quote from leadership</span>
            <blockquote className="text-white italic text-base leading-relaxed my-4">
              "We measure our success in hours returned to builders. When you automate the tedious workflows, you unlock real human creative momentum."
            </blockquote>
            <div className="border-t border-white/5 pt-4 text-xs">
              <div className="font-bold text-white">Slayzi Founders</div>
              <div className="text-slate-400">San Francisco, CA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mb-24 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white text-center mb-16">Our Growth Timeline</h2>

        <div className="relative border-l border-brand-purple/20 pl-8 ml-4 flex flex-col gap-12">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Dot */}
              <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-[#0A0A0F] border-2 border-brand-purple flex items-center justify-center">
                <Calendar className="h-2 w-2 text-brand-light" />
              </div>

              <div>
                <span className="inline-block px-2.5 py-1 bg-brand-purple/10 border border-brand-purple/20 text-brand-light text-xs font-bold rounded mb-2 font-display">
                  {event.year}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 font-display">{event.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="relative rounded-2xl overflow-hidden p-8 sm:p-12 border border-white/5 text-center flex flex-col items-center justify-center gap-6 glass-panel">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 glow-purple-blur opacity-25 rounded-full" />
        <h3 className="text-2xl font-bold text-white font-display relative z-10">We Are Growing</h3>
        <p className="text-slate-300 text-sm max-w-md mx-auto relative z-10">
          Want to shape the future of autonomous workflows? Slayzi is hiring AI solutions engineers and full-stack API developers.
        </p>
        <div className="flex flex-wrap gap-4 relative z-10">
          <Link to="/custom">
            <MagneticButton className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold text-xs shadow-glow">
              Get Started
            </MagneticButton>
          </Link>
          <a href="#" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white hover:bg-white/10 flex items-center gap-1.5">
            View Careers
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
