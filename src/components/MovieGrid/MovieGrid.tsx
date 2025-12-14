import type { Movie } from "../../types/movie";
import styles from "./MovieGrid.module.css";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const posterBaseUrl = "https://image.tmdb.org/t/p/w500";
const placeholderPoster = "https://via.placeholder.com/500x750?text=No+Image";

const MovieGrid = ({ movies, onSelect }: MovieGridProps) => (
  <ul className={styles.grid}>
    {movies.map((movie) => (
      <li key={movie.id}>
        <div className={styles.card} onClick={() => onSelect(movie)}>
          <img
            className={styles.image}
            src={
              movie.poster_path
                ? `${posterBaseUrl}${movie.poster_path}`
                : placeholderPoster
            }
            alt={movie.title}
            loading="lazy"
          />
          <h2 className={styles.title}>{movie.title}</h2>
        </div>
      </li>
    ))}
  </ul>
);

export default MovieGrid;
