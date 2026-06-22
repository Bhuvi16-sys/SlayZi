import React from "react";
import { motion } from "framer-motion";
import { Award, Compass, Users, Target, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MagneticButton } from "../components/MagneticButton";

export default function About() {
  const timelineEvents = [
    {
      year: "Late 2024",
      title: "First Admissions Automation",
      description: "We built our first custom automation system for Saraswati Vidyamandir in Ambala, resolving CBSE admissions inquiries instantly day and night to prevent missed enrollments.",
    },
    {
      year: "Early 2025",
      title: "Full CBSE Operations Layer",
      description: "Expanded the system into a complete AI operations layer: automated CBSE homework check-scoring, a 24/7 Socratic WhatsApp tutor, and lecture editing systems.",
    },
    {
      year: "Late 2025",
      title: "Generalizing Slayzi Modules",
      description: "Packaged the proven SVM codebase into ready-to-deploy modular templates tailored for other sectors like Real Estate, Lending, and Outbound campaigns.",
    },
    {
      year: "2026",
      title: "Founder-Led Scale Operations",
      description: "Slayzi is officially launched, delivering direct, founder-led integrations and zero-risk pilot trials to fast-growing businesses looking to automate the busywork.",
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
          We Build AI Operations, Not Generic Chatbots
        </h1>
        <p className="text-slate-400 text-sm max-w-xl text-center">
          Slayzi was created to remove the wall of manual, repetitive work that fast-growing businesses face, delivering actual production code that works while you sleep.
        </p>
      </div>

      {/* Core Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative z-10">
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-light flex items-center justify-center mb-5">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 font-display">Trained on Your Data</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            We don't sell generic templates. Every agent we deploy is trained directly on your files, knowledge base, customers, and active workflows.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-light flex items-center justify-center mb-5">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 font-display">Founder-Led Delivery</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            You deal directly with the developers programming your AI workflows. No intermediate account executives or sales layers blocking development.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-light flex items-center justify-center mb-5">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 font-display">Proven in Production</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            We are not showcasing mockups or prototypes. Our agents run live in production daily, handling real customers, students, and files.
          </p>
        </div>
      </div>

      {/* Founder Story */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-24 relative z-10">
        <div className="md:col-span-7">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">The Slayzi Story</h2>
          <div className="flex flex-col gap-4 text-slate-300 text-sm leading-relaxed">
            <p>
              In late 2024, we started by solving a very real problem for our reference client, <strong>Saraswati Vidyamandir</strong>, a CBSE coaching institute in Ambala. What began as a single WhatsApp inquiry responder quickly grew into a full AI operations layer.
            </p>
            <p>
              We watched the institute's staff get buried in hours of manual paperwork daily—answering the same admissions questions, guiding student doubt-solving, grading CBSE homework, and trying to edit classroom clips for marketing.
            </p>
            <p>
              By training custom agents directly on their curriculum and processes, we automated the repetitive 80% of their operational burden. Today, those systems handle admissions, tutoring, and grading live every single day with zero manual staff effort. That proof is what drives Slayzi as we build for businesses in real estate, lending, and operations.
            </p>
          </div>
        </div>
        
        {/* Story Visual Side Card */}
        <div className="md:col-span-5">
          <div className="glass-panel p-8 rounded-2xl border border-brand-purple/30 relative overflow-hidden bg-gradient-to-tr from-[#140D2B] via-[#0A0A0F] to-[#0D0D18]">
            <div className="absolute -top-10 -right-10 w-32 h-32 glow-purple-blur rounded-full opacity-40 pointer-events-none" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-light font-display">Operations Principle</span>
            <blockquote className="text-white italic text-base leading-relaxed my-4">
              "We don't pitch slides; we deploy real workers. When you remove the daily busywork, you give your team the time to actually scale the business."
            </blockquote>
            <div className="border-t border-white/5 pt-4 text-xs">
              <div className="font-bold text-white">Slayzi Founders</div>
              <div className="text-slate-400">Ambala, Haryana</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mb-24 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white text-center mb-16">Our Journey</h2>

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
        <h3 className="text-2xl font-bold text-white font-display relative z-10">Ready to Remove the Wall?</h3>
        <p className="text-slate-300 text-sm max-w-md mx-auto relative z-10">
          Book a 15-minute demo and watch a custom-built Slayzi agent operate live. Start your free pilot period today.
        </p>
        <div className="flex flex-wrap gap-4 relative z-10 justify-center">
          <Link to="/custom">
            <MagneticButton className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold text-xs shadow-glow">
              Book a Demo
            </MagneticButton>
          </Link>
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white hover:bg-white/10 flex items-center gap-1.5">
            WhatsApp Us
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
