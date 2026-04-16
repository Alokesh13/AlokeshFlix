import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import MovieDetail from "./pages/MovieDetail";
import TVDetail from "./pages/TVDetail";
import WatchMovie from "./pages/WatchMovie";
import WatchTV from "./pages/WatchTV";
import Search from "./pages/Search";
import MyList from "./pages/MyList";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#141414] text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TVShows />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<TVDetail />} />
            <Route path="/watch/movie/:id" element={<WatchMovie />} />
            <Route path="/watch/tv/:id/:season/:episode" element={<WatchTV />} />
            <Route path="/search" element={<Search />} />
            <Route path="/mylist" element={<MyList />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
