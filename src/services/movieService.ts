import axios from "axios";
import type { Movie } from "../types/movie";

export interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const token = import.meta.env.VITE_TMDB_TOKEN;

if (!token) {
  throw new Error("Missing TMDB token");
}

const client = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchMovies = async (
  query: string,
  page = 1
): Promise<MovieSearchResponse> => {
  const response = await client.get<MovieSearchResponse>("/search/movie", {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
  });

  return response.data;
};
