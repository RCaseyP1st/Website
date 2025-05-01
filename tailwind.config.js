/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all JS and JSX files in the project for Tailwind classes
    "./public/index.html", // Include your main HTML file (if relevant)
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: '#0093a4',  // Main blue
        brandGreen: '#7fbf71', // Accent green
        brandPink: '#d60b52',  // Accent pink
      },
      fontFamily: {
        sans: ['"Source Sans Pro"', 'sans-serif'],
      },
      backdropFilter: {
        none: "none",
        blur: "blur(16px)",
      },
    },
    
  },
  plugins: [],
};
