import { useCallback, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import styles from "./App.module.css";

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    setSelectedMovie(null);
    setMovies([]);
    setError(false);
    if (!query) {
      return;
    }
    setLoading(true);
    try {
      const data = await fetchMovies(query);
      if (!data.length) {
        toast.error("No movies found for your request.");
      }
      setMovies(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelect = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <div className={styles.app}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <SearchBar onSubmit={handleSearch} />
      {error && <ErrorMessage />}
      {!error && loading && <Loader />}
      {!error && !loading && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
