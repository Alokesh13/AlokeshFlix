import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Film, Tv } from "lucide-react";
import { searchMulti } from "../services/tmdb";
import type { MultiSearchResult } from "../types/tmdb";
import MediaCard from "../components/MediaCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<MultiSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setPage(1);
    searchMulti(query, 1)
      .then((r) => {
        setResults(r.results.filter((x) => x.media_type !== "person"));
        setTotalPages(r.total_pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  const loadMore = () => {
    if (page >= totalPages || loading) return;
    const next = page + 1;
    searchMulti(query, next)
      .then((r) => {
        setResults((prev) => [...prev, ...r.results.filter((x) => x.media_type !== "person")]);
        setPage(next);
      })
      .catch(console.error);
  };

  const filtered =
    filter === "all"
      ? results
      : results.filter((r) => r.media_type === filter);

  const movieCount = results.filter((r) => r.media_type === "movie").length;
  const tvCount = results.filter((r) => r.media_type === "tv").length;

  return (
    <div className="bg-[#141414] min-h-screen pt-24 pb-16 px-4 md:px-8 lg:px-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SearchIcon className="w-6 h-6 text-[#e50914]" />
          <h1 className="text-white text-2xl md:text-3xl font-black">
            {query ? `Results for "${query}"` : "Search"}
          </h1>
        </div>
        {results.length > 0 && (
          <p className="text-gray-500 text-sm">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Filter Tabs */}
      {results.length > 0 && (
        <div className="flex gap-2 mb-8">
          {[
            { value: "all" as const, label: `All (${results.length})` },
            { value: "movie" as const, label: `Movies (${movieCount})`, icon: Film },
            { value: "tv" as const, label: `TV Shows (${tvCount})`, icon: Tv },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === tab.value
                  ? "bg-[#e50914] text-white shadow-lg shadow-red-900/30"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-white text-2xl font-bold mb-2">No results found</h2>
          <p className="text-gray-500">
            {query
              ? `We couldn't find anything for "${query}"`
              : "Start typing to search for movies and TV shows"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((item) => (
              <MediaCard
                key={`${item.media_type}-${item.id}`}
                item={item}
                mediaType={item.media_type as "movie" | "tv"}
              />
            ))}
          </div>

          {page < totalPages && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMore}
                className="px-10 py-3 bg-[#e50914] text-white font-bold rounded-lg hover:bg-[#b8070f] transition-colors shadow-lg"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
