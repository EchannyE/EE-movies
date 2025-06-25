import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import MovieDetails from './Pages/MovieDetails';
import Login from './Pages/Login';
import Signup from './Pages/SignUp';
import Profile from './Pages/Profile';
import Navbar from './Components/Navbar';
import Watchlist from './Pages/WatchList';
import { Toaster } from 'react-hot-toast';
import Movies from './Pages/Movies';
import EditProfile from './Pages/EditProfile';



function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/:id/followers" element={<Profile />} />
          <Route path="/profile/:id/following" element={<Profile />} />
          <Route path="/profile/:id/reviews" element={<Profile />} />
          <Route path="/profile/:id/uploaded-movies" element={<Profile />} />
          <Route path="/profile/:id/recommendations" element={<Profile />} />
          <Route path="/profile/:id/liked" element={<Profile />} />
          <Route path="/profile/:id/watchlist" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />

          {/* Catch-all route to redirect to Home if no match */}
          <Route path="*" element={<Home />} />
          
         



        </Routes>
      </Router>
    </>
  );
}

export default App;
