import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Star, Clock, Calendar, X, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getMovieDetails, getSimilarMovies, getImageUrl } from "../services/tmdb";
import type { MovieDetails } from "../types/tmdb";
import type { Movie } from "../types/tmdb";
import MediaRow from "../components/MediaRow";
import LoadingSpinner from "../components/LoadingSpinner";

const WatchMovie: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);

    Promise.all([
      getMovieDetails(parseInt(id)),
      getSimilarMovies(parseInt(id)),
    ])
      .then(([m, s]) => {
        setMovie(m);
        setSimilar(s.results);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      try {
        if (typeof event.data === "string") {
          JSON.parse(event.data);
        }
      } catch (_) {}
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!movie) return (
    <div className="bg-premium min-h-screen flex items-center justify-center">
      <p className="text-white text-xl">Movie not found.</p>
    </div>
  );

  const posterUrl = getImageUrl(movie.poster_path, "w300");
  const backdropUrl = getImageUrl(movie.backdrop_path, "w780");
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  const embedUrl = `https://www.vidking.net/embed/movie/${movie.id}?color=c9a227&autoPlay=true`;

  return (
    <div className="bg-[#080810] min-h-screen">
      {/* Player Section */}
      <div className="bg-black pt-16">
        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between px-4 md:px-8 py-3.5 border-b border-white/5 bg-[#080810]/80 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-300 hover:text-[#c9a227] transition-colors glass-card px-3 py-2 rounded-lg border border-white/5 hover:border-[#c9a227]/30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </motion.button>
          </div>

          {/* Title info */}
          <div className="flex items-center gap-3 flex-1 mx-4">
            {posterUrl && (
              <div className="w-8 h-11 rounded-lg overflow-hidden border border-[#c9a227]/20 shrink-0 shadow-lg">
                <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-white font-bold text-sm md:text-base leading-tight line-clamp-1">{movie.title}</h1>
              <div className="flex items-center gap-2 text-gray-400 text-xs mt-0.5">
                {movie.release_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                )}
                {runtime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {runtime}
                  </span>
                )}
                {movie.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-[#c9a227] font-semibold">
                    <Star className="w-3 h-3 fill-[#c9a227]" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2.5 rounded-xl transition-all border ${
              showInfo
                ? "bg-[#c9a227]/20 text-[#c9a227] border-[#c9a227]/40"
                : "glass-card text-gray-400 hover:text-[#c9a227] border-white/5 hover:border-[#c9a227]/30"
            }`}
          >
            {showInfo ? <X className="w-4 h-4" /> : <Info className="w-4 h-4" />}
          </motion.button>
        </motion.div>

        {/* Player + Info Panel */}
        <div className="flex flex-col lg:flex-row" style={{ minHeight: "calc(100vh - 120px)" }}>
          {/* Player */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 relative bg-black"
            style={{ minHeight: "56.25vw", maxHeight: showInfo ? "70vh" : "85vh" }}
          >
            {/* Decorative gradient frame */}
            <div className="absolute inset-0 p-0.5 rounded-none lg:rounded-none pointer-events-none z-10">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/20 to-transparent" />
            </div>
            <iframe
              src={embedUrl}
              className="w-full h-full"
              style={{ minHeight: "450px" }}
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
            />
          </motion.div>

          {/* Info Panel */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "380px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden lg:block overflow-hidden border-l border-white/5 bg-[#0d0d1a]"
              >
                <div className="p-6 w-[380px]">
                  {/* Backdrop thumbnail */}
                  {backdropUrl && (
                    <div className="rounded-xl overflow-hidden mb-5 border border-white/5">
                      <img src={backdropUrl} alt={movie.title} className="w-full aspect-video object-cover" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <Film className="w-4 h-4 text-[#c9a227]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#c9a227]">Movie</span>
                  </div>

                  <h2 className="text-white font-black text-xl mb-2 leading-tight">{movie.title}</h2>

                  {movie.tagline && (
                    <p className="text-[#c9a227]/60 italic text-sm mb-4">"{movie.tagline}"</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.vote_average > 0 && (
                      <span className="flex items-center gap-1 bg-[#c9a227]/10 border border-[#c9a227]/30 text-[#c9a227] text-xs font-bold px-2.5 py-1.5 rounded-lg">
                        <Star className="w-3 h-3 fill-[#c9a227]" />
                        {movie.vote_average.toFixed(1)}
                      </span>
                    )}
                    {runtime && (
                      <span className="flex items-center gap-1 glass-card border border-white/5 text-gray-400 text-xs px-2.5 py-1.5 rounded-lg">
                        <Clock className="w-3 h-3" />
                        {runtime}
                      </span>
                    )}
                    {movie.release_date && (
                      <span className="glass-card border border-white/5 text-gray-400 text-xs px-2.5 py-1.5 rounded-lg">
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                    )}
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {movie.genres?.map((g) => (
                      <span key={g.id} className="text-xs px-2.5 py-1 rounded-lg glass-card border border-[#c9a227]/15 text-[#c9a227]/80">
                        {g.name}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{movie.overview}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Similar Movies */}
      {similar.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pt-10"
        >
          <MediaRow title="More Like This" items={similar} mediaType="movie" />
        </motion.div>
      )}
    </div>
  );
};

export default WatchMovie;
