import axios from "axios";
import type {
  Movie,
  TVShow,
  MovieDetails,
  TVDetails,
  Credits,
  TMDBResponse,
  MultiSearchResult,
  Episode,
} from "../types/tmdb";

const API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export const getImageUrl = (
  path: string | null,
  size: "w200" | "w300" | "w400" | "w500" | "w780" | "original" = "w500"
) => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Movies
export const getTrendingMovies = (): Promise<TMDBResponse<Movie>> =>
  api.get("/trending/movie/week").then((r) => r.data);

export const getPopularMovies = (page = 1): Promise<TMDBResponse<Movie>> =>
  api.get("/movie/popular", { params: { page } }).then((r) => r.data);

export const getTopRatedMovies = (page = 1): Promise<TMDBResponse<Movie>> =>
  api.get("/movie/top_rated", { params: { page } }).then((r) => r.data);

export const getUpcomingMovies = (page = 1): Promise<TMDBResponse<Movie>> =>
  api.get("/movie/upcoming", { params: { page } }).then((r) => r.data);

export const getNowPlayingMovies = (page = 1): Promise<TMDBResponse<Movie>> =>
  api.get("/movie/now_playing", { params: { page } }).then((r) => r.data);

export const getMovieDetails = (id: number): Promise<MovieDetails> =>
  api.get(`/movie/${id}`).then((r) => r.data);

export const getMovieCredits = (id: number): Promise<Credits> =>
  api.get(`/movie/${id}/credits`).then((r) => r.data);

export const getSimilarMovies = (id: number): Promise<TMDBResponse<Movie>> =>
  api.get(`/movie/${id}/similar`).then((r) => r.data);

export const getMoviesByGenre = (
  genreId: number,
  page = 1
): Promise<TMDBResponse<Movie>> =>
  api
    .get("/discover/movie", { params: { with_genres: genreId, page } })
    .then((r) => r.data);

// TV Shows
export const getTrendingTV = (): Promise<TMDBResponse<TVShow>> =>
  api.get("/trending/tv/week").then((r) => r.data);

export const getPopularTV = (page = 1): Promise<TMDBResponse<TVShow>> =>
  api.get("/tv/popular", { params: { page } }).then((r) => r.data);

export const getTopRatedTV = (page = 1): Promise<TMDBResponse<TVShow>> =>
  api.get("/tv/top_rated", { params: { page } }).then((r) => r.data);

export const getOnAirTV = (page = 1): Promise<TMDBResponse<TVShow>> =>
  api.get("/tv/on_the_air", { params: { page } }).then((r) => r.data);

export const getAiringTodayTV = (page = 1): Promise<TMDBResponse<TVShow>> =>
  api.get("/tv/airing_today", { params: { page } }).then((r) => r.data);

export const getTVDetails = (id: number): Promise<TVDetails> =>
  api.get(`/tv/${id}`).then((r) => r.data);

export const getTVCredits = (id: number): Promise<Credits> =>
  api.get(`/tv/${id}/credits`).then((r) => r.data);

export const getSimilarTV = (id: number): Promise<TMDBResponse<TVShow>> =>
  api.get(`/tv/${id}/similar`).then((r) => r.data);

export const getSeasonEpisodes = (
  tvId: number,
  seasonNumber: number
): Promise<{ episodes: Episode[] }> =>
  api.get(`/tv/${tvId}/season/${seasonNumber}`).then((r) => r.data);

// Search
export const searchMulti = (
  query: string,
  page = 1
): Promise<TMDBResponse<MultiSearchResult>> =>
  api.get("/search/multi", { params: { query, page } }).then((r) => r.data);

export const searchMovies = (
  query: string,
  page = 1
): Promise<TMDBResponse<Movie>> =>
  api.get("/search/movie", { params: { query, page } }).then((r) => r.data);

export const searchTV = (
  query: string,
  page = 1
): Promise<TMDBResponse<TVShow>> =>
  api.get("/search/tv", { params: { query, page } }).then((r) => r.data);

// Genres
export const getMovieGenres = (): Promise<{ genres: { id: number; name: string }[] }> =>
  api.get("/genre/movie/list").then((r) => r.data);

export const getTVGenres = (): Promise<{ genres: { id: number; name: string }[] }> =>
  api.get("/genre/tv/list").then((r) => r.data);
