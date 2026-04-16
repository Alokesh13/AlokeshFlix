import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Star, Calendar, ArrowLeft, Tv, ChevronDown, Users, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getTVDetails,
  getTVCredits,
  getSimilarTV,
  getSeasonEpisodes,
  getImageUrl,
} from "../services/tmdb";
import type { TVDetails, Credits, Episode } from "../types/tmdb";
import type { TVShow } from "../types/tmdb";
import LoadingSpinner from "../components/LoadingSpinner";
import MediaRow from "../components/MediaRow";

const TVDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<TVDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [similar, setSimilar] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    window.scrollTo(0, 0);

    Promise.all([
      getTVDetails(parseInt(id)),
      getTVCredits(parseInt(id)),
      getSimilarTV(parseInt(id)),
    ])
      .then(([s, c, sim]) => {
        setShow(s);
        setCredits(c);
        setSimilar(sim.results);
        const firstValid = s.seasons.find((season) => season.season_number > 0);
        if (firstValid) setSelectedSeason(firstValid.season_number);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !selectedSeason) return;
    setLoadingEpisodes(true);
    getSeasonEpisodes(parseInt(id), selectedSeason)
      .then((r) => setEpisodes(r.episodes || []))
      .catch(console.error)
      .finally(() => setLoadingEpisodes(false));
  }, [id, selectedSeason]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!show) return (
    <div className="bg-premium min-h-screen flex items-center justify-center">
      <p className="text-white text-xl">Show not found.</p>
    </div>
  );

  const backdropUrl = getImageUrl(show.backdrop_path, "original");
  const posterUrl = getImageUrl(show.poster_path, "w500");
  const topCast = credits?.cast.slice(0, 8) || [];
  const validSeasons = show.seasons.filter((s) => s.season_number > 0);

  return (
    <div className="bg-premium min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        {backdropUrl ? (
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            src={backdropUrl}
            alt={show.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-[#080810]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/50 to-[#080810]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080810]/80 to-transparent" />

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
                <img src={posterUrl} alt={show.name} className="w-full transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full aspect-[2/3] bg-[#1a1a2e] flex items-center justify-center">
                  <Tv className="w-16 h-16 text-gray-600" />
                </div>
              )}
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
              {show.genres?.map((g) => (
                <span key={g.id} className="text-xs font-semibold px-3 py-1.5 rounded-lg glass-card border border-[#c9a227]/20 text-[#c9a227]">
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-2 tracking-tight">
              {show.name}
            </h1>

            {show.tagline && (
              <p className="text-[#c9a227]/70 italic text-base mb-4">"{show.tagline}"</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
              {show.vote_average > 0 && (
                <div className="flex items-center gap-1.5 bg-[#c9a227]/10 border border-[#c9a227]/30 text-[#c9a227] font-bold px-3 py-1.5 rounded-lg">
                  <Star className="w-4 h-4 fill-[#c9a227]" />
                  {show.vote_average.toFixed(1)}/10
                </div>
              )}
              {show.first_air_date && (
                <div className="flex items-center gap-1.5 text-gray-400 glass-card px-3 py-1.5 rounded-lg border border-white/5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(show.first_air_date).getFullYear()}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-gray-400 glass-card px-3 py-1.5 rounded-lg border border-white/5">
                <Tv className="w-3.5 h-3.5 text-[#c9a227]" />
                {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? "s" : ""}
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                show.status === "Returning Series"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "glass-card border-white/5 text-gray-400"
              }`}>
                <Award className="w-3.5 h-3.5" />
                {show.status}
              </div>
            </div>

            <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-2xl">
              {show.overview || "No description available."}
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/watch/tv/${show.id}/${selectedSeason}/1`)}
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

        {/* Episodes */}
        {validSeasons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 mb-10"
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#c9a227] to-[#e8c84a] rounded-full" />
                <h2 className="text-white text-2xl font-bold">Episodes</h2>
              </div>

              {/* Season Selector */}
              <div className="relative">
                <button
                  onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                  className="flex items-center gap-2 glass-card border border-[#c9a227]/30 text-[#c9a227] px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-[#c9a227]/60 transition-all"
                >
                  Season {selectedSeason}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${seasonDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {seasonDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 glass-card border border-white/10 rounded-xl shadow-2xl z-20 min-w-[160px] overflow-hidden max-h-64 overflow-y-auto"
                    >
                      {validSeasons.map((s) => (
                        <button
                          key={s.season_number}
                          onClick={() => { setSelectedSeason(s.season_number); setSeasonDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                            selectedSeason === s.season_number
                              ? "bg-[#c9a227]/20 text-[#c9a227] font-bold"
                              : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          Season {s.season_number}
                          <span className="text-xs ml-2 opacity-50">({s.episode_count} eps)</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {loadingEpisodes ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {episodes.map((ep, i) => {
                  const stillUrl = getImageUrl(ep.still_path, "w300");
                  return (
                    <motion.div
                      key={ep.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i * 0.04, 0.4) }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      onClick={() => navigate(`/watch/tv/${show.id}/${selectedSeason}/${ep.episode_number}`)}
                      className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-[#c9a227]/30 transition-all duration-300 cursor-pointer group card-shine"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        {stillUrl ? (
                          <img
                            src={stillUrl}
                            alt={ep.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#1a1a2e] flex items-center justify-center">
                            <Play className="w-8 h-8 text-gray-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            className="w-12 h-12 rounded-full bg-[#c9a227]/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <Play className="w-5 h-5 text-[#080810] fill-[#080810] ml-0.5" />
                          </motion.div>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-[#080810]/80 backdrop-blur-sm text-[#c9a227] text-xs px-2.5 py-1 rounded-lg font-bold border border-[#c9a227]/20">
                          E{ep.episode_number}
                        </div>
                        {ep.runtime && (
                          <div className="absolute bottom-2 right-2 bg-[#080810]/80 backdrop-blur-sm text-gray-300 text-xs px-2 py-1 rounded-lg">
                            {ep.runtime}m
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-white text-sm font-bold line-clamp-1 group-hover:text-[#c9a227] transition-colors">{ep.name}</p>
                        {ep.vote_average > 0 && (
                          <div className="flex items-center gap-1 mt-1 mb-1.5">
                            <Star className="w-3 h-3 text-[#c9a227] fill-[#c9a227]" />
                            <span className="text-[#c9a227] text-xs font-semibold">{ep.vote_average.toFixed(1)}</span>
                          </div>
                        )}
                        <p className="text-gray-500 text-xs line-clamp-2">{ep.overview || "No description."}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-8">
            <MediaRow title="Similar Shows" items={similar} mediaType="tv" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TVDetail;
