import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Star, Clock, Calendar, ArrowLeft, Award, Users } from "lucide-react";
import { motion } from "framer-motion";
import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getImageUrl,
} from "../services/tmdb";
import type { MovieDetails, Credits } from "../types/tmdb";
import type { Movie } from "../types/tmdb";
import LoadingSpinner from "../components/LoadingSpinner";
import MediaRow from "../components/MediaRow";

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    window.scrollTo(0, 0);

    Promise.all([
      getMovieDetails(parseInt(id)),
      getMovieCredits(parseInt(id)),
      getSimilarMovies(parseInt(id)),
    ])
      .then(([m, c, s]) => {
        setMovie(m);
        setCredits(c);
        setSimilar(s.results);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!movie) return (
    <div className="bg-premium min-h-screen flex items-center justify-center">
      <p className="text-white text-xl">Movie not found.</p>
    </div>
  );

  const backdropUrl = getImageUrl(movie.backdrop_path, "original");
  const posterUrl = getImageUrl(movie.poster_path, "w500");
  const director = credits?.crew.find((c) => c.job === "Director");
  const topCast = credits?.cast.slice(0, 8) || [];
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "N/A";

  return (
    <div className="bg-premium min-h-screen">
      {/* Hero Backdrop */}
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        {backdropUrl ? (
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-[#080810]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/50 to-[#080810]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080810]/80 to-transparent" />

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 md:left-8 flex items-center gap-2 text-white glass-card hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all border border-white/10 hover:border-[#c9a227]/40 hover:text-[#c9a227]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 lg:px-14 -mt-44 md:-mt-52 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="shrink-0 mx-auto md:mx-0"
          >
            <div className="w-44 md:w-60 lg:w-72 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 relative group">
              {posterUrl ? (
                <img src={posterUrl} alt={movie.title} className="w-full transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full aspect-[2/3] bg-[#1a1a2e] flex items-center justify-center text-5xl">🎬</div>
              )}
              {/* Gold shimmer border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-[#c9a227]/0 group-hover:border-[#c9a227]/30 transition-all duration-500 pointer-events-none" />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 mt-4 md:mt-20"
          >
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map((g) => (
                <span key={g.id} className="text-xs font-semibold px-3 py-1.5 rounded-lg glass-card border border-[#c9a227]/20 text-[#c9a227]">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 tracking-tight">
              {movie.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1.5 bg-[#c9a227]/10 border border-[#c9a227]/30 text-[#c9a227] font-bold px-3 py-1.5 rounded-lg">
                  <Star className="w-4 h-4 fill-[#c9a227]" />
                  {movie.vote_average.toFixed(1)}/10
                </div>
              )}
              {movie.release_date && (
                <div className="flex items-center gap-1.5 text-gray-400 glass-card px-3 py-1.5 rounded-lg border border-white/5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(movie.release_date).getFullYear()}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-gray-400 glass-card px-3 py-1.5 rounded-lg border border-white/5">
                <Clock className="w-3.5 h-3.5" />
                {runtime}
              </div>
              {director && (
                <div className="flex items-center gap-1.5 text-gray-400 glass-card px-3 py-1.5 rounded-lg border border-white/5">
                  <Award className="w-3.5 h-3.5 text-[#c9a227]" />
                  <span>{director.name}</span>
                </div>
              )}
            </div>

            {/* Overview */}
            <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-2xl">
              {movie.overview || "No description available."}
            </p>

            {/* Play Button */}
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/watch/movie/${movie.id}`)}
                className="btn-premium flex items-center gap-3 px-8 py-4 rounded-xl text-base shadow-xl shadow-[#c9a227]/20"
              >
                <div className="w-8 h-8 rounded-full bg-[#080810]/20 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                Watch Now
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Cast */}
        {topCast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-[#c9a227] to-[#e8c84a] rounded-full" />
              <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-[#c9a227]" />
                Top Cast
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {topCast.map((actor, i) => {
                const profileUrl = getImageUrl(actor.profile_path, "w200");
                return (
                  <motion.div
                    key={actor.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    className="text-center group cursor-pointer"
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden mb-2.5 glass-card border border-white/5 group-hover:border-[#c9a227]/30 transition-all duration-300">
                      {profileUrl ? (
                        <img src={profileUrl} alt={actor.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl bg-[#1a1a2e]">👤</div>
                      )}
                    </div>
                    <p className="text-white text-xs font-semibold line-clamp-1">{actor.name}</p>
                    <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">{actor.character}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-14">
            <MediaRow title="More Like This" items={similar} mediaType="movie" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
