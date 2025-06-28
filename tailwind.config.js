

/** @type {import('tailwindcss').Config} */
module.exports = {

  darkMode: 'class', 
  
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ make sure this matches your files
  ],
  theme: {
    extend: {
      
    },
  },
  plugins: [],
};
