import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiSearch } from "react-icons/bi";
import { Moon, Sun, UserCircle2, Menu, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
 


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);



  useEffect(() => {
    const welcome = localStorage.getItem('welcome');
    const username = localStorage.getItem('username');
    if (welcome && username) {
      toast.success(`🎉 Welcome back, ${username}!`, { duration: 4000 });
      localStorage.removeItem('welcome');
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  // Toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <>
      <Toaster position="top-right" />
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg border-b border-gray-700 relative z-10">
        <Link to="/" className="text-2xl font-bold text-yellow-500 hover:text-yellow-400 transition duration-200">
          De Elite Movies
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          <Link to="/movies" className="hover:text-yellow-400 transition duration-200">Movies</Link>
          <Link to="signup" className="hover:text-yellow-400 transition duration-200">SignUp</Link>
          <Link to="/watchlist" className="hover:text-yellow-400 transition duration-200">Watchlist</Link>
          <Link to="/profile" className="hover:text-yellow-400 transition duration-200 flex items-center gap-1">
            <UserCircle2 size={18} />
          </Link>

          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-md overflow-hidden shadow-sm">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-black px-3 py-1 w-48 focus:outline-none"
              aria-label="Search movies"
            />
            <button
              type="submit"
              className="text-gray-700 hover:text-black px-3 py-1"
              aria-label="Search"
            >
              <BiSearch size={20} />
            </button>
          </form>

          <button
            onClick={toggleDarkMode}
            className="bg-gray-950 text-white px-4 py-1 rounded-md hover:bg-gray-600 transition flex items-center gap-2"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            
          </button>
        </div>

        <button
          className="lg:hidden block text-white focus:outline-none z-20 "
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-gray-900 flex flex-col gap-4 items-center py-4 shadow-lg border-t border-gray-700 lg:hidden">
            <Link to="/movies" className="hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>Movies</Link>
            <Link to="/signup" className="hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>SignUp</Link>
            <Link to="/profile" className="hover:text-yellow-400 flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
              <UserCircle2 size={18} /> Profile
            </Link>
            <Link to="/watchlist" className="hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>Watchlist</Link>

            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-md overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-black px-3 py-1 w-48 focus:outline-none"
                aria-label="Search movies"
              />
              <button
                type="submit"
                className="text-gray-700 hover:text-black px-3 py-1"
                aria-label="Search"
              >
                <BiSearch size={20} />
              </button>
            </form>

            <button
              onClick={toggleDarkMode}
              className="bg-gray-700 text-white px-4 py-1 rounded-md hover:bg-gray-600 transition flex items-center gap-2"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
