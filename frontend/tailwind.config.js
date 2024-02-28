/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nfsans: ["NfSans", "sans-serif"],
        nfbold: ["NfSans-Bold", "sans-serif"],
        nflight:["NfSans-Light", "sans-serif"],
        // Add more custom font families as needed
      },
    },
  },
  plugins: [],
}

