import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown, Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/movies" },
    { label: "TV Shows", path: "/tv" },
    { label: "My List", path: "/mylist" },
  ];

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path));

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#080810]/95 backdrop-blur-xl border-b border-white/[0.04] shadow-2xl shadow-black/80"
            : "bg-gradient-to-b from-black/80 via-black/30 to-transparent"
        }`}
      >
        <div className="px-4 md:px-8 lg:px-14 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <Sparkles className="w-5 h-5 text-[#c9a227]" />
                  <div className="absolute inset-0 animate-ping opacity-30">
                    <Sparkles className="w-5 h-5 text-[#c9a227]" />
                  </div>
                </div>
                <span className="font-black text-2xl md:text-3xl tracking-tight leading-none select-none">
                  <span className="gold-text">Alokesh</span>
                  <span className="text-white">Flix</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                      isActive(link.path)
                        ? "text-[#c9a227]"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {isActive(link.path) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent rounded-full"
                      />
                    )}
                    <div className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-colors duration-200" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <div className="relative flex items-center">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.form
                    key="search-open"
                    initial={{ width: 40, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 40, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onSubmit={handleSearch}
                    className="flex items-center"
                  >
                    <div className="flex items-center glass-card rounded-xl px-3 py-2 gap-2 border border-[#c9a227]/20">
                      <Search className="w-4 h-4 text-[#c9a227] shrink-0" />
                      <input
                        ref={searchRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search movies, shows..."
                        className="bg-transparent text-white text-sm outline-none w-40 md:w-56 placeholder-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                        className="text-gray-400 hover:text-white ml-1 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.button
                    key="search-closed"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchOpen(true)}
                    className="p-2.5 text-gray-300 hover:text-[#c9a227] transition-colors rounded-xl hover:bg-white/5"
                  >
                    <Search className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="hidden md:block relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2.5 text-gray-300 hover:text-[#c9a227] transition-colors rounded-xl hover:bg-white/5 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c9a227] rounded-full animate-pulse" />
              </motion.button>
            </div>

            {/* Profile */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="hidden md:flex items-center gap-2 cursor-pointer group glass-card rounded-xl px-3 py-1.5 border border-white/5 hover:border-[#c9a227]/30 transition-all duration-300"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#c9a227] to-[#8b5e00] flex items-center justify-center text-[#080810] text-xs font-black shadow-lg">
                A
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white font-medium transition-colors">Alokesh</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#c9a227] transition-all group-hover:rotate-180 duration-300" />
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-[#080810]/98 backdrop-blur-xl pt-20 px-6"
          >
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-2 relative z-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 ${
                      isActive(link.path)
                        ? "text-[#c9a227] bg-[#c9a227]/10 border border-[#c9a227]/20"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 pt-6 border-t border-white/5"
              >
                <form onSubmit={handleSearch} className="flex items-center glass-card rounded-xl px-4 py-3 gap-3 border border-[#c9a227]/20">
                  <Search className="w-4 h-4 text-[#c9a227]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies, shows..."
                    className="bg-transparent text-white outline-none flex-1 placeholder-gray-500"
                  />
                </form>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
