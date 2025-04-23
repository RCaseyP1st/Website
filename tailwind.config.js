/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all JS and JSX files in the project for Tailwind classes
    "./public/index.html", // Include your main HTML file (if relevant)
  ],
  theme: {
    extend: {
      colors: {
        cyan: '#0093a2', // Define a custom cyan color
      },
      fontFamily: {
        sans: ['"Source Sans Pro"', 'sans-serif'], // Use 'Century Gothic' as the primary sans-serif font
      },
      backdropFilter: {
        none: "none",
        blur: "blur(16px)", // Add blur for glassmorphism
      },
    },
  },
  plugins: [],
};
