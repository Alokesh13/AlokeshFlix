import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Info, ChevronLeft, ChevronRight, Star, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../services/tmdb";
import type { Movie, TVShow } from "../types/tmdb";

interface HeroSectionProps {
  items: (Movie | TVShow)[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  const heroItems = items.slice(0, 6);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % heroItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroItems.length]);

  if (!heroItems.length) return null;

  const item = heroItems[currentIndex];
  const isMovie = "title" in item;
  const title = isMovie ? (item as Movie).title : (item as TVShow).name;
  const date = isMovie ? (item as Movie).release_date : (item as TVShow).first_air_date;
  const mediaType = isMovie ? "movie" : "tv";
  const backdropUrl = getImageUrl(item.backdrop_path, "original");
  const year = date ? new Date(date).getFullYear() : "";

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((p) => (p - 1 + heroItems.length) % heroItems.length);
  };

  const next = () => {
    setDirection(1);
    setCurrentIndex((p) => (p + 1) % heroItems.length);
  };

  const handlePlay = () => {
    if (isMovie) navigate(`/watch/movie/${item.id}`);
    else navigate(`/watch/tv/${item.id}/1/1`);
  };

  const handleMoreInfo = () => navigate(`/${mediaType}/${item.id}`);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.98 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.98 }),
  };

  return (
    <div className="relative w-full h-[92vh] min-h-[600px] overflow-hidden bg-[#080810]">
      {/* Background Image with parallax feel */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {backdropUrl ? (
            <img
              src={backdropUrl}
              alt={title}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-[#080810]" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Multi-layer overlays for premium depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080810] via-[#080810]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/20 to-[#080810]/30" />
      <div className="absolute inset-0 hero-vignette" />

      {/* Animated gold accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent" />

      {/* Left floating nav arrow */}
      <motion.button
        whileHover={{ scale: 1.1, x: -3 }}
        whileTap={{ scale: 0.9 }}
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 glass-card rounded-full border border-white/10 hover:border-[#c9a227]/40 text-white hover:text-[#c9a227] transition-all duration-300 hidden md:flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, x: 3 }}
        whileTap={{ scale: 0.9 }}
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 glass-card rounded-full border border-white/10 hover:border-[#c9a227]/40 text-white hover:text-[#c9a227] transition-all duration-300 hidden md:flex items-center justify-center"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-14 lg:px-20 max-w-4xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Top badges */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#c9a227] to-[#e8c84a] text-[#080810] text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg"
              >
                {mediaType === "movie" ? "🎬 Movie" : "📺 Series"}
              </motion.span>

              {item.vote_average > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-1.5 glass-card text-[#c9a227] text-sm font-bold px-3 py-1.5 rounded-lg border border-[#c9a227]/30"
                >
                  <Star className="w-3.5 h-3.5 fill-[#c9a227]" />
                  {item.vote_average.toFixed(1)}
                </motion.span>
              )}

              {year && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-1.5 text-gray-300 text-sm glass-card px-3 py-1.5 rounded-lg border border-white/10"
                >
                  <Clock className="w-3.5 h-3.5" />
                  {year}
                </motion.span>
              )}
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] max-w-3xl mb-5 tracking-tight"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.8)" }}
            >
              {title}
            </motion.h1>

            {/* Overview */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-gray-300 text-sm md:text-base max-w-xl leading-relaxed mb-8 line-clamp-3"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
            >
              {item.overview || "No description available."}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={handlePlay}
                className="btn-premium flex items-center gap-3 px-8 py-3.5 rounded-xl text-base shadow-xl z-10 relative"
              >
                <div className="w-8 h-8 rounded-full bg-[#080810]/20 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                Play Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleMoreInfo}
                className="flex items-center gap-3 glass-card text-white font-semibold px-8 py-3.5 rounded-xl text-base border border-white/15 hover:border-[#c9a227]/40 hover:text-[#c9a227] transition-all duration-300 backdrop-blur-sm"
              >
                <Info className="w-5 h-5" />
                More Info
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators - bottom right */}
      <div className="absolute right-6 md:right-14 bottom-8 md:bottom-12 flex items-center gap-3 z-20">
        {heroItems.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 rounded-full ${
              i === currentIndex
                ? "w-8 h-2 bg-gradient-to-r from-[#c9a227] to-[#e8c84a] shadow-lg shadow-[#c9a227]/40"
                : "w-2 h-2 bg-white/20 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Thumbnail strip - desktop */}
      <div className="absolute bottom-6 left-6 md:left-14 hidden lg:flex items-center gap-3 z-20">
        {heroItems.map((hi, i) => {
          const hiTitle = "title" in hi ? (hi as Movie).title : (hi as TVShow).name;
          const hiThumb = getImageUrl(hi.backdrop_path, "w300");
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goTo(i)}
              className={`relative w-20 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                i === currentIndex
                  ? "border-[#c9a227] shadow-lg shadow-[#c9a227]/30"
                  : "border-white/10 opacity-50 hover:opacity-80"
              }`}
            >
              {hiThumb ? (
                <img src={hiThumb} alt={hiTitle} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-800" />
              )}
              {i === currentIndex && (
                <div className="absolute inset-0 bg-[#c9a227]/10" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default HeroSection;
