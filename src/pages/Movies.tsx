import React, { useEffect, useState, useCallback } from "react";
import { Film, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MediaCard from "../components/MediaCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getPopularMovies, getTopRatedMovies, getUpcomingMovies,
  getNowPlayingMovies, getMovieGenres, getMoviesByGenre,
} from "../services/tmdb";
import type { Movie } from "../types/tmdb";

type FilterType = "popular" | "top_rated" | "upcoming" | "now_playing" | string;

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<FilterType>("popular");
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [showGenres, setShowGenres] = useState(false);

  useEffect(() => {
    getMovieGenres().then((r) => setGenres(r.genres));
  }, []);

  const fetchMovies = useCallback(
    async (f: FilterType, p: number, append = false) => {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      try {
        let result;
        const numericGenreId = parseInt(f);
        if (!isNaN(numericGenreId)) {
          result = await getMoviesByGenre(numericGenreId, p);
        } else {
          switch (f) {
            case "top_rated": result = await getTopRatedMovies(p); break;
            case "upcoming": result = await getUpcomingMovies(p); break;
            case "now_playing": result = await getNowPlayingMovies(p); break;
            default: result = await getPopularMovies(p);
          }
        }
        setTotalPages(result.total_pages);
        if (append) setMovies((prev) => [...prev, ...result.results]);
        else setMovies(result.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    fetchMovies(filter, 1, false);
  }, [filter, fetchMovies]);

  const loadMore = () => {
    if (page < totalPages && !loadingMore) {
      const next = page + 1;
      setPage(next);
      fetchMovies(filter, next, true);
    }
  };

  const filterOptions = [
    { value: "popular", label: "Popular" },
    { value: "top_rated", label: "Top Rated" },
    { value: "upcoming", label: "Upcoming" },
    { value: "now_playing", label: "Now Playing" },
  ];

  const activeGenre = genres.find((g) => String(g.id) === filter);

  return (
    <div className="bg-premium min-h-screen pt-24 pb-16">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a227]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="px-4 md:px-8 lg:px-14 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#c9a227]/10 border border-[#c9a227]/30 rounded-xl">
              <Film className="w-6 h-6 text-[#c9a227]" />
            </div>
            <div>
              <h1 className="text-white text-3xl md:text-4xl font-black tracking-tight">Movies</h1>
              {activeGenre && (
                <p className="text-[#c9a227] text-sm font-semibold mt-0.5">{activeGenre.name}</p>
              )}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGenres(!showGenres)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              showGenres
                ? "bg-[#c9a227]/20 text-[#c9a227] border-[#c9a227]/40"
                : "glass-card text-gray-300 border-white/10 hover:border-[#c9a227]/30 hover:text-[#c9a227]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Genres
          </motion.button>
        </motion.div>

        {/* Type Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-4"
        >
          {filterOptions.map((opt) => (
            <motion.button
              key={opt.value}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFilter(opt.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                filter === opt.value
                  ? "bg-gradient-to-r from-[#c9a227] to-[#e8c84a] text-[#080810] border-transparent shadow-lg shadow-[#c9a227]/20"
                  : "glass-card text-gray-300 border-white/8 hover:border-[#c9a227]/30 hover:text-white"
              }`}
            >
              {opt.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Genre Filters */}
        <AnimatePresence>
          {showGenres && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mb-6 pt-2">
                {genres.map((g) => (
                  <motion.button
                    key={g.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { setFilter(String(g.id)); setShowGenres(false); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                      filter === String(g.id)
                        ? "bg-gradient-to-r from-[#c9a227] to-[#e8c84a] text-[#080810] border-transparent"
                        : "glass-card text-gray-400 border-white/5 hover:border-[#c9a227]/20 hover:text-[#c9a227]"
                    }`}
                  >
                    {g.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="mt-4">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {movies.map((movie, i) => (
                    <MediaCard key={movie.id} item={movie} mediaType="movie" index={i} />
                  ))}
                </div>

                {page < totalPages && (
                  <div className="flex justify-center mt-12">
                    <motion.button
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="btn-premium px-12 py-4 rounded-xl font-bold text-base shadow-xl shadow-[#c9a227]/20 disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-[#080810]/30 border-t-[#080810] rounded-full animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        "Load More"
                      )}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;
