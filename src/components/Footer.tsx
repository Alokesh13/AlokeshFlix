import React from "react";
import { Sparkles, Globe, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: "🌐", label: "Website" },
    { icon: "📧", label: "Contact" },
    { icon: "💬", label: "Discord" },
    { icon: "▶️", label: "YouTube" },
  ];

  return (
    <footer className="relative bg-[#080810] border-t border-white/[0.04] py-16 px-4 md:px-8 lg:px-14 overflow-hidden">
      {/* Decorative BG */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#c9a227]/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-14">
          {/* Brand */}
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <Sparkles className="w-5 h-5 text-[#c9a227]" />
              <span className="font-black text-2xl">
                <span className="gold-text">Alokesh</span>
                <span className="text-white">Flix</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Your premium destination for the finest movies and TV series. Curated for the discerning viewer.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon, label }) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 glass-card rounded-xl border border-white/5 hover:border-[#c9a227]/30 text-gray-500 hover:text-[#c9a227] transition-all duration-300 text-base"
                  title={label}
                >
                  {icon}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-widest">Navigate</h4>
              <ul className="space-y-3">
                {[
                  { label: "Home", path: "/" },
                  { label: "Movies", path: "/movies" },
                  { label: "TV Shows", path: "/tv" },
                  { label: "My List", path: "/mylist" },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-500 text-sm hover:text-[#c9a227] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-widest">Company</h4>
              <ul className="space-y-3">
                {["About Us", "Careers", "Press", "Blog"].map((item) => (
                  <li key={item}>
                    <span className="text-gray-500 text-sm cursor-pointer hover:text-[#c9a227] transition-colors duration-200">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms of Use", "Cookie Policy", "Legal Notices"].map((item) => (
                  <li key={item}>
                    <span className="text-gray-500 text-sm cursor-pointer hover:text-[#c9a227] transition-colors duration-200">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm flex items-center gap-2">
            Made with <Heart className="w-3.5 h-3.5 text-[#c9a227] fill-[#c9a227]" /> by{" "}
            <span className="gold-text font-bold">Alokesh</span> · © {new Date().getFullYear()} AlokeshFlix
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Powered by{" "}
              <span className="text-[#c9a227] font-semibold">TMDB</span>
            </span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Stream via{" "}
              <span className="text-[#c9a227] font-semibold">VidKing</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
