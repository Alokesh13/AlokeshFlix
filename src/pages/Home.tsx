import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import MediaRow from "../components/MediaRow";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingTV,
  getPopularTV,
  getTopRatedTV,
  getNowPlayingMovies,
  getOnAirTV,
} from "../services/tmdb";
import type { Movie, TVShow } from "../types/tmdb";

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [trendingAll, setTrendingAll] = useState<(Movie | TVShow)[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [trendingTV, setTrendingTV] = useState<TVShow[]>([]);
  const [popularTV, setPopularTV] = useState<TVShow[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<TVShow[]>([]);
  const [onAirTV, setOnAirTV] = useState<TVShow[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          trendMovies,
          popMovies,
          topMovies,
          nowPlay,
          trendTV,
          popTV,
          topTV,
          onAir,
        ] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
          getNowPlayingMovies(),
          getTrendingTV(),
          getPopularTV(),
          getTopRatedTV(),
          getOnAirTV(),
        ]);

        const merged: (Movie | TVShow)[] = [
          ...trendMovies.results.slice(0, 10),
          ...trendTV.results.slice(0, 5),
        ].sort((a, b) => b.popularity - a.popularity);

        setTrendingAll(merged);
        setPopularMovies(popMovies.results);
        setTopRatedMovies(topMovies.results);
        setNowPlaying(nowPlay.results);
        setTrendingTV(trendTV.results);
        setPopularTV(popTV.results);
        setTopRatedTV(topTV.results);
        setOnAirTV(onAir.results);
      } catch (err) {
        console.error("Failed to fetch home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="bg-premium min-h-screen">
      <HeroSection items={trendingAll} />

      {/* Content Rows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 -mt-6 pt-4"
      >
        {/* Subtle top fade */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#080810] to-transparent pointer-events-none z-10" />

        <div className="pt-8">
          <MediaRow title="Now In Cinemas" items={nowPlaying} mediaType="movie" badge="New" />
          <MediaRow title="Trending Movies" items={popularMovies} mediaType="movie" />
          <MediaRow title="Trending This Week" items={trendingTV} mediaType="tv" badge="Hot" badgeColor="bg-gradient-to-r from-red-600 to-orange-500 text-white" />
          <MediaRow title="Top Rated Movies" items={topRatedMovies} mediaType="movie" badge="⭐ Top" badgeColor="bg-gradient-to-r from-[#c9a227]/20 to-[#e8c84a]/20 text-[#c9a227] border border-[#c9a227]/30" />
          <MediaRow title="Popular TV Shows" items={popularTV} mediaType="tv" />
          <MediaRow title="Currently On Air" items={onAirTV} mediaType="tv" badge="Live" badgeColor="bg-green-500/20 text-green-400 border border-green-500/30" />
          <MediaRow title="Top Rated Series" items={topRatedTV} mediaType="tv" />
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
