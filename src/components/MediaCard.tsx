import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Star, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../services/tmdb";
import type { Movie, TVShow, MultiSearchResult } from "../types/tmdb";

type MediaItem = Movie | TVShow | MultiSearchResult;

interface MediaCardProps {
  item: MediaItem;
  mediaType?: "movie" | "tv";
  index?: number;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, mediaType, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const isMovie =
    mediaType === "movie" ||
    ("media_type" in item && item.media_type === "movie") ||
    ("title" in item && !("media_type" in item));

  const resolvedType = mediaType || (isMovie ? "movie" : "tv");
  const title = "title" in item ? (item as Movie).title : (item as TVShow).name;
  const date =
    "release_date" in item
      ? (item as Movie).release_date
      : (item as TVShow).first_air_date;
  const year = date ? new Date(date).getFullYear() : "";
  const posterUrl = getImageUrl(item.poster_path, "w400");

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (resolvedType === "movie") navigate(`/watch/movie/${item.id}`);
    else navigate(`/watch/tv/${item.id}/1/1`);
  };

  const handleInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/${resolvedType}/${item.id}`);
  };

  const handleCardClick = () => navigate(`/${resolvedType}/${item.id}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="relative group flex-shrink-0 cursor-pointer rounded-xl overflow-hidden card-shine"
      style={{ aspectRatio: "2/3" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
      whileHover={{ scale: 1.04, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      <div className="w-full h-full">
        {posterUrl && !imageError ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] flex items-center justify-center">
            <div className="text-center p-3">
              <div className="text-4xl mb-2">🎬</div>
              <p className="text-gray-400 text-xs text-center line-clamp-3">{title}</p>
            </div>
          </div>
        )}
      </div>

      {/* Always visible gradient at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#080810] to-transparent" />

      {/* Rating badge - top right */}
      {item.vote_average > 0 && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#080810]/80 backdrop-blur-sm text-[#c9a227] text-xs font-bold px-2 py-1 rounded-lg border border-[#c9a227]/20">
          <Star className="w-3 h-3 fill-[#c9a227]" />
          {item.vote_average.toFixed(1)}
        </div>
      )}

      {/* Type badge - top left */}
      <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-lg ${
        resolvedType === "movie"
          ? "bg-blue-500/80 text-white"
          : "bg-purple-500/80 text-white"
      } backdrop-blur-sm`}>
        {resolvedType === "movie" ? "Film" : "TV"}
      </div>

      {/* Hover Overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/70 to-[#080810]/20"
          />
        )}
      </AnimatePresence>

      {/* Hover Content */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-3"
          >
            <p className="text-white text-sm font-bold mb-1.5 line-clamp-1">{title}</p>

            <div className="flex items-center gap-2 mb-3">
              {year && <span className="text-gray-300 text-xs">{year}</span>}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={handlePlay}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#c9a227] to-[#e8c84a] text-[#080810] font-bold text-xs px-3 py-2 rounded-lg flex-1 justify-center shadow-lg"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Play
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleInfo}
                className="p-2 glass-card rounded-lg border border-white/15 hover:border-[#c9a227]/40 text-white hover:text-[#c9a227] transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gold shimmer border on hover */}
      <div className={`absolute inset-0 rounded-xl border-2 transition-all duration-300 pointer-events-none ${
        hovered ? "border-[#c9a227]/40 shadow-lg shadow-[#c9a227]/10" : "border-transparent"
      }`} />
    </motion.div>
  );
};

export default MediaCard;
