import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send, MessageSquare, Heart } from "lucide-react";
import { FaXTwitter, FaLinkedin, FaGithub, FaDiscord } from 'react-icons/fa6';
import Logo from "./Logo";
import LogoLoop from "./LogoLoop";

const socialLogos = [
  { node: <FaXTwitter />, title: "X", href: "https://twitter.com" },
  { node: <FaLinkedin />, title: "LinkedIn", href: "https://linkedin.com" },
  { node: <FaGithub />, title: "GitHub", href: "https://github.com" },
  { node: <FaDiscord />, title: "Discord", href: "https://discord.com" },
];
export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubsubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubsubscribed(true);
      setEmail("");
      setTimeout(() => setSubsubscribed(false), 5000);
    }
  };

  return (
    <footer className="relative bg-[#07070B] border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] glow-purple-blur opacity-40 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          
          {/* Logo & Description */}
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Slayzi builds high-performance, autonomous AI agents that handle operations, marketing, sales, and support for your business 24/7. Ready to automate?
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              {socialLogos.map((social, idx) => (
                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-xl" aria-label={social.title}>
                  {social.node}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links 1 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Platform</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li>
                <Link to="/agents" className="hover:text-brand-light transition-colors">AI Marketplace</Link>
              </li>
              <li>
                <Link to="/custom" className="hover:text-brand-light transition-colors">Custom AI CRM</Link>
              </li>
              <li>
                <a href="#" className="hover:text-brand-light transition-colors">API Docs</a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-light transition-colors">Agent SDK</a>
              </li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Company</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-brand-light transition-colors">About Us</Link>
              </li>
              <li>
                <a href="#" className="hover:text-brand-light transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-light transition-colors">Press Kit</a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-light transition-colors">Partners</a>
              </li>
            </ul>
          </div>

          {/* Newsletter Input */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Stay Updated</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get the latest updates on new AI agents and automation tactics.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0F]/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple transition-all duration-300 pr-12 glass-panel"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-brand-purple hover:bg-brand-pink text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
            {subscribed && (
              <p className="text-emerald-400 text-xs animate-fade-in">
                Thank you! You have successfully subscribed to the Slayzi newsletter.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Slayzi Inc. All rights reserved. Tagline: Ready to Automate.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Sitemap</a>
          </div>
          <p className="flex items-center gap-1">
            Built for efficiency with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by Slayzi
          </p>
        </div>
      </div>
    </footer>
  );
}
