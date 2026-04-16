import React, { useEffect, useState, useCallback } from "react";
import { Tv } from "lucide-react";
import MediaCard from "../components/MediaCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getPopularTV,
  getTopRatedTV,
  getOnAirTV,
  getAiringTodayTV,
  getTVGenres,
} from "../services/tmdb";
import type { TVShow } from "../types/tmdb";
import axios from "axios";

type FilterType = "popular" | "top_rated" | "on_air" | "airing_today" | string;

const TVShows: React.FC = () => {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<FilterType>("popular");
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    getTVGenres().then((r) => setGenres(r.genres));
  }, []);

  const fetchShows = useCallback(
    async (f: FilterType, p: number, append = false) => {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      try {
        let result;
        const numericGenreId = parseInt(f);
        if (!isNaN(numericGenreId)) {
          result = await axios
            .get("https://api.themoviedb.org/3/discover/tv", {
              params: { api_key: "8265bd1679663a7ea12ac168da84d2e8", with_genres: numericGenreId, page: p },
            })
            .then((r) => r.data);
        } else {
          switch (f) {
            case "top_rated": result = await getTopRatedTV(p); break;
            case "on_air": result = await getOnAirTV(p); break;
            case "airing_today": result = await getAiringTodayTV(p); break;
            default: result = await getPopularTV(p);
          }
        }

        setTotalPages(result.total_pages);
        if (append) {
          setShows((prev) => [...prev, ...result.results]);
        } else {
          setShows(result.results);
        }
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
    fetchShows(filter, 1, false);
  }, [filter, fetchShows]);

  const loadMore = () => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchShows(filter, nextPage, true);
    }
  };

  const filterOptions = [
    { value: "popular", label: "Popular" },
    { value: "top_rated", label: "Top Rated" },
    { value: "on_air", label: "On Air" },
    { value: "airing_today", label: "Airing Today" },
  ];

  return (
    <div className="bg-[#141414] min-h-screen pt-24 pb-16">
      <div className="px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Tv className="w-7 h-7 text-[#e50914]" />
          <h1 className="text-white text-3xl md:text-4xl font-black">TV Shows</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  filter === opt.value
                    ? "bg-[#e50914] text-white shadow-lg shadow-red-900/30"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 10).map((g) => (
              <button
                key={g.id}
                onClick={() => setFilter(String(g.id))}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  filter === String(g.id)
                    ? "bg-[#e50914] text-white shadow-lg shadow-red-900/30"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {shows.map((show) => (
                <MediaCard key={show.id} item={show} mediaType="tv" />
              ))}
            </div>

            {/* Load More */}
            {page < totalPages && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-10 py-3 bg-[#e50914] text-white font-bold rounded-lg hover:bg-[#b8070f] transition-colors disabled:opacity-50 shadow-lg"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TVShows;
