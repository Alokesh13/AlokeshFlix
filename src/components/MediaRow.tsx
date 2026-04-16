import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import MediaCard from "./MediaCard";
import type { Movie, TVShow, MultiSearchResult } from "../types/tmdb";

type MediaItem = Movie | TVShow | MultiSearchResult;

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  mediaType?: "movie" | "tv";
  badge?: string;
  badgeColor?: string;
}

const MediaRow: React.FC<MediaRowProps> = ({ title, items, mediaType, badge, badgeColor }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  if (!items.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mb-12 group/row"
    >
      {/* Row Header */}
      <div className="flex items-center gap-3 mb-5 px-4 md:px-8 lg:px-14">
        <div className="flex items-center gap-3">
          {/* Gold accent line */}
          <div className="w-1 h-6 bg-gradient-to-b from-[#c9a227] to-[#e8c84a] rounded-full" />
          <h2 className="text-white text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
        </div>
        {badge && (
          <span
            className={`text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${
              badgeColor ||
              "bg-gradient-to-r from-[#c9a227] to-[#e8c84a] text-[#080810]"
            }`}
          >
            {badge}
          </span>
        )}
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-2" />
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollLeft ? 1 : 0 }}
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 w-14 md:w-20 flex items-center justify-center bg-gradient-to-r from-[#080810] via-[#080810]/90 to-transparent text-white pointer-events-none"
          style={{ pointerEvents: canScrollLeft ? "auto" : "none" }}
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 glass-card rounded-full border border-white/10 hover:border-[#c9a227]/40 hover:text-[#c9a227] transition-all opacity-0 group-hover/row:opacity-100 duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.div>
        </motion.button>

        {/* Cards */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto scrollbar-none px-4 md:px-8 lg:px-14 pb-3"
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              className="shrink-0"
              style={{ width: "clamp(130px, 14vw, 190px)" }}
            >
              <MediaCard item={item} mediaType={mediaType} index={i} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollRight ? 1 : 0 }}
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 w-14 md:w-20 flex items-center justify-center bg-gradient-to-l from-[#080810] via-[#080810]/90 to-transparent text-white"
          style={{ pointerEvents: canScrollRight ? "auto" : "none" }}
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 glass-card rounded-full border border-white/10 hover:border-[#c9a227]/40 hover:text-[#c9a227] transition-all opacity-0 group-hover/row:opacity-100 duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MediaRow;
