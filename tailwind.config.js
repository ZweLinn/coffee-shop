/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#5D4037", // warm amber-brown (caramel)
        white: {
          DEFAULT: "#ffffff",
          100: "#FAF6F1", // warm off-white (cream)
          200: "#C47B2B", // matches primary (caramel accent)
        },
        gray: {
          100: "#9A8C82", // warm taupe-gray
          200: "#9A8C82",
        },
        dark: {
          100: "#1C1209", // deep espresso black
        },
        error: "#D94F3D", // slightly warmer red
        success: "#4A7C59", // muted earthy green
      },
      fontFamily: {
        quicksand: ["Quicksand-Regular", "sans-serif"],
        "quicksand-bold": ["Quicksand-Bold", "sans-serif"],
        "quicksand-semibold": ["Quicksand-SemiBold", "sans-serif"],
        "quicksand-light": ["Quicksand-Light", "sans-serif"],
        "quicksand-medium": ["Quicksand-Medium", "sans-serif"],
      },
    },
  },
  plugins: [],
};
