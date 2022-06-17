/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, lazy, UIEvent, FC } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../styles/App.css";
import { moviesType } from "../types/movies";
import { RootState } from "../utils/redux/reducers/reducer";
const Layout = lazy(() => import("../components/Layout"));
const MovieCard = lazy(() => import("../components/MovieCard"));
const MovieLoading = lazy(() => import("../components/MovieLoading"));

const Homepage: FC = () => {
  const favorites = useSelector((state: RootState) => state.favorites);
  const [skeleton] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [movies, setMovies] = useState<moviesType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [noData, setNoData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetchData(page);
  }, []);

  const handleScrollFetch = async (e: UIEvent<HTMLElement>) => {
    let element = e.target as HTMLElement;
    const bottom =
      element.scrollHeight - element.scrollTop === element.clientHeight;
    if (bottom) {
      !noData && fetchData(page);
    }
  };

  const fetchData = async (page: number) => {
    const newPage = page + 1;
    await axios
      .get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${page}`
      )
      .then((response) => {
        const { results } = response.data;
        document.title = "Cinephile - My Favorite Movies";
        const temp: moviesType[] = [...movies];
        temp.push(...results);
        if (results.length === 0) setNoData(true);
        else {
          setMovies(temp);
          setPage(newPage);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Layout onScroll={handleScrollFetch}>
      <h1 className="text-slate-900 dark:text-white text-5xl text-center my-10">
        My Favorite Movies
      </h1>
      <div className="grid grid-flow-row auto-rows-max grid-cols-2 md:grid-cols-4 lg:grid-cols-5 m-2 gap-3">
        {loading
          ? skeleton.map((item) => {
              return <MovieLoading key={item} />;
            })
          : favorites.map((item: any) => {
              return (
                <MovieCard
                  key={item.id}
                  item={item}
                  navigate={`/detail/${item.id}`}
                  onClick={() => alert("On Development")}
                />
              );
            })}
      </div>
    </Layout>
  );
};

export default Homepage;
