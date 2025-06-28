import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Privacy from './Components/Privacy';
import TermsAndConditions from './Components/TermsAndConditions';

import Home from './Pages/Home';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import WatchList from './Pages/WatchList';
import MovieDetails from './Pages/MovieDetails';
import Movies from './Pages/Movies';
import EditProfile from './Pages/EditProfile';


import { WatchlistProvider } from './Hook/WatchlistContext';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <WatchlistProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-gray-950 text-white">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile/:id?" element={<Profile />} />
                <Route path="/profile/edit/:id" element={<EditProfile />} />
                <Route path="/watchlist" element={<WatchList />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/movies/:id" element={<MovieDetails />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="*" element={<h1 className="text-white text-center mt-10">Page Not Found</h1>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </WatchlistProvider>
      </Router>
    </>
  );
}

export default App;
