import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: Boolean(searchQuery),
    placeholderData: (previousData) => previousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;
  const shouldShowLoader = Boolean(searchQuery) && (isPending || isFetching);

  useEffect(() => {
    if (searchQuery && data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSelectedMovie(null);
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleSelect = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const handlePageChange = useCallback(({ selected }: { selected: number }) => {
    setPage(selected + 1);
    setSelectedMovie(null);
  }, []);

  return (
    <div className={styles.app}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <SearchBar onSubmit={handleSearch} />
      {isError && <ErrorMessage />}
      {!isError && shouldShowLoader && <Loader />}
      {!isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}
      {!isError && movies.length > 0 && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
