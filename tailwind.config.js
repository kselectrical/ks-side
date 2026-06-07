/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: "#0F172A", // Primary Dark Navy
          "blue-dark": "#020617",
          "blue-light": "#F1F5F9",
          orange: "#F97316", // Accent Orange
          "orange-dark": "#EA580C",
          success: "#22C55E",
          charcoal: "#1E293B",
          dark: "#0F172A",
          gray: "#64748B",
          light: "#F8FAFC",
          silver: "#E2E8F0",
        }
      },
      boxShadow: {
        'card': '0 4px 10px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -1px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 12px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.05)',
        'dropdown': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
        'search': '0 10px 30px -10px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}
