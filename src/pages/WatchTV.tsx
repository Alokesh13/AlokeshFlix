import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Info, Star, Calendar, ChevronLeft, ChevronRight,
  ChevronDown, Tv, Play, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getTVDetails, getSimilarTV, getSeasonEpisodes, getImageUrl,
} from "../services/tmdb";
import type { TVDetails, Episode } from "../types/tmdb";
import type { TVShow } from "../types/tmdb";
import MediaRow from "../components/MediaRow";
import LoadingSpinner from "../components/LoadingSpinner";

const WatchTV: React.FC = () => {
  const { id, season, episode } = useParams<{ id: string; season: string; episode: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<TVDetails | null>(null);
  const [similar, setSimilar] = useState<TVShow[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);

  const currentSeason = parseInt(season || "1");
  const currentEpisode = parseInt(episode || "1");

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    Promise.all([getTVDetails(parseInt(id)), getSimilarTV(parseInt(id))])
      .then(([s, sim]) => { setShow(s); setSimilar(sim.results); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !currentSeason) return;
    getSeasonEpisodes(parseInt(id), currentSeason)
      .then((r) => setEpisodes(r.episodes || []))
      .catch(console.error);
  }, [id, currentSeason]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      try {
        if (typeof event.data === "string") {
          const parsed = JSON.parse(event.data);
          if (parsed?.data?.event === "ended") {
            const nextEp = currentEpisode + 1;
            const nextEpExists = episodes.some((e) => e.episode_number === nextEp);
            if (nextEpExists) {
              navigate(`/watch/tv/${id}/${currentSeason}/${nextEp}`, { replace: true });
            }
          }
        }
      } catch (_) {}
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [currentEpisode, currentSeason, episodes, id, navigate]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!show) return (
    <div className="bg-premium min-h-screen flex items-center justify-center">
      <p className="text-white text-xl">Show not found.</p>
    </div>
  );

  const posterUrl = getImageUrl(show.poster_path, "w300");
  const validSeasons = show.seasons.filter((s) => s.season_number > 0);
  const currentEpData = episodes.find((e) => e.episode_number === currentEpisode);
  const prevEp = currentEpisode > 1 ? currentEpisode - 1 : null;
  const nextEp = episodes.some((e) => e.episode_number === currentEpisode + 1) ? currentEpisode + 1 : null;

  const embedUrl = `https://www.vidking.net/embed/tv/${show.id}/${currentSeason}/${currentEpisode}?color=c9a227&autoPlay=true&nextEpisode=true&episodeSelector=true`;

  return (
    <div className="bg-[#080810] min-h-screen">
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

          <div className="flex items-center gap-3 flex-1 mx-4">
            {posterUrl && (
              <div className="w-7 h-10 rounded-lg overflow-hidden border border-[#c9a227]/20 shrink-0">
                <img src={posterUrl} alt={show.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-white font-bold text-sm md:text-base leading-tight line-clamp-1">{show.name}</h1>
              <p className="text-[#c9a227] text-xs font-semibold">
                S{currentSeason} · E{currentEpisode}
                {currentEpData ? ` · ${currentEpData.name}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => { setShowEpisodes(!showEpisodes); setShowInfo(false); }}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all border ${
                showEpisodes
                  ? "bg-[#c9a227]/20 text-[#c9a227] border-[#c9a227]/40"
                  : "glass-card text-gray-400 hover:text-[#c9a227] border-white/5 hover:border-[#c9a227]/30"
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              Episodes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => { setShowInfo(!showInfo); setShowEpisodes(false); }}
              className={`p-2.5 rounded-xl transition-all border ${
                showInfo
                  ? "bg-[#c9a227]/20 text-[#c9a227] border-[#c9a227]/40"
                  : "glass-card text-gray-400 hover:text-[#c9a227] border-white/5 hover:border-[#c9a227]/30"
              }`}
            >
              {showInfo ? <X className="w-4 h-4" /> : <Info className="w-4 h-4" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Player */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative bg-black"
          style={{ aspectRatio: "16/9", maxHeight: "calc(100vh - 130px)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/20 to-transparent pointer-events-none z-10" />
          <iframe
            key={embedUrl}
            src={embedUrl}
            className="w-full h-full"
            style={{ display: "block", minHeight: "400px" }}
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            title={`${show.name} S${currentSeason}E${currentEpisode}`}
          />
        </motion.div>

        {/* Episode Nav Bar */}
        <div className="flex items-center justify-between px-4 md:px-8 py-3 border-t border-white/5 bg-[#0a0a14]">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            disabled={!prevEp}
            onClick={() => prevEp && navigate(`/watch/tv/${id}/${currentSeason}/${prevEp}`)}
            className="flex items-center gap-2 text-sm font-semibold disabled:opacity-20 disabled:cursor-not-allowed text-gray-300 hover:text-[#c9a227] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Prev</span>
          </motion.button>

          {/* Season Selector */}
          <div className="relative">
            <button
              onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
              className="flex items-center gap-2 glass-card border border-[#c9a227]/30 text-[#c9a227] px-4 py-2 rounded-xl text-sm font-bold hover:border-[#c9a227]/60 transition-all"
            >
              <Tv className="w-3.5 h-3.5" />
              S{currentSeason} · E{currentEpisode}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${seasonDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {seasonDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 glass-card border border-white/10 rounded-xl shadow-2xl z-50 min-w-[160px] overflow-hidden"
                >
                  {validSeasons.map((s) => (
                    <button
                      key={s.season_number}
                      onClick={() => { navigate(`/watch/tv/${id}/${s.season_number}/1`); setSeasonDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                        currentSeason === s.season_number
                          ? "bg-[#c9a227]/20 text-[#c9a227] font-bold"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      Season {s.season_number}
                      <span className="text-xs opacity-50">{s.episode_count}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            disabled={!nextEp}
            onClick={() => nextEp && navigate(`/watch/tv/${id}/${currentSeason}/${nextEp}`)}
            className="flex items-center gap-2 text-sm font-semibold disabled:opacity-20 disabled:cursor-not-allowed text-gray-300 hover:text-[#c9a227] transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-white/5 bg-[#0d0d1a]"
          >
            <div className="px-4 md:px-8 py-6">
              <div className="max-w-4xl flex gap-5">
                {posterUrl && (
                  <img src={posterUrl} alt={show.name} className="w-20 md:w-28 rounded-xl shadow-xl shrink-0 border border-white/5" />
                )}
                <div>
                  <h2 className="text-white text-xl font-black mb-1">{show.name}</h2>
                  {show.tagline && <p className="text-[#c9a227]/60 italic text-sm mb-3">"{show.tagline}"</p>}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {show.vote_average > 0 && (
                      <span className="flex items-center gap-1 bg-[#c9a227]/10 border border-[#c9a227]/30 text-[#c9a227] text-xs font-bold px-2.5 py-1 rounded-lg">
                        <Star className="w-3 h-3 fill-[#c9a227]" />
                        {show.vote_average.toFixed(1)}
                      </span>
                    )}
                    {show.first_air_date && (
                      <span className="flex items-center gap-1 glass-card border border-white/5 text-gray-400 text-xs px-2.5 py-1 rounded-lg">
                        <Calendar className="w-3 h-3" />
                        {new Date(show.first_air_date).getFullYear()}
                      </span>
                    )}
                    <span className="glass-card border border-white/5 text-gray-400 text-xs px-2.5 py-1 rounded-lg">
                      {show.number_of_seasons} Seasons
                    </span>
                  </div>
                  {show.genres && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {show.genres.map((g) => (
                        <span key={g.id} className="text-xs px-2.5 py-1 rounded-lg glass-card border border-[#c9a227]/15 text-[#c9a227]/80">
                          {g.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{show.overview}</p>

                  {currentEpData && (
                    <div className="mt-4 p-3 glass-card border border-[#c9a227]/20 rounded-xl">
                      <p className="text-[#c9a227] text-xs font-bold uppercase tracking-widest mb-1">▶ Now Playing</p>
                      <p className="text-white font-bold text-sm">S{currentSeason}E{currentEpisode}: {currentEpData.name}</p>
                      {currentEpData.overview && (
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{currentEpData.overview}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Episode List */}
      <AnimatePresence>
        {showEpisodes && episodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-white/5 bg-[#0d0d1a]"
          >
            <div className="px-4 md:px-8 py-6">
              <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-[#c9a227] to-[#e8c84a] rounded-full" />
                Season {currentSeason} Episodes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {episodes.map((ep) => {
                  const stillUrl = getImageUrl(ep.still_path, "w300");
                  const isCurrent = ep.episode_number === currentEpisode;
                  return (
                    <motion.div
                      key={ep.id}
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/watch/tv/${id}/${currentSeason}/${ep.episode_number}`)}
                      className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group ${
                        isCurrent
                          ? "border-2 border-[#c9a227] shadow-lg shadow-[#c9a227]/20"
                          : "border border-white/5 hover:border-[#c9a227]/30 glass-card"
                      }`}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        {stillUrl ? (
                          <img src={stillUrl} alt={ep.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-[#1a1a2e] flex items-center justify-center">
                            <Play className="w-6 h-6 text-gray-600" />
                          </div>
                        )}
                        {isCurrent && (
                          <div className="absolute inset-0 bg-[#c9a227]/10 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#c9a227] flex items-center justify-center shadow-lg">
                              <Play className="w-4 h-4 text-[#080810] fill-[#080810] ml-0.5" />
                            </div>
                          </div>
                        )}
                        <div className={`absolute bottom-1.5 left-1.5 text-xs px-2 py-0.5 rounded-lg font-bold ${
                          isCurrent
                            ? "bg-[#c9a227] text-[#080810]"
                            : "bg-[#080810]/80 text-gray-300"
                        }`}>
                          E{ep.episode_number}
                        </div>
                      </div>
                      <div className="p-2.5">
                        <p className={`text-xs font-bold line-clamp-1 ${isCurrent ? "text-[#c9a227]" : "text-white"}`}>
                          {ep.name}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{ep.overview || "No description."}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Similar */}
      {similar.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pt-10"
        >
          <MediaRow title="More Like This" items={similar} mediaType="tv" />
        </motion.div>
      )}
    </div>
  );
};

export default WatchTV;
