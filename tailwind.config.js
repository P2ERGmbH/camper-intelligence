/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "plus-jakarta-sans": ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
      colors: {
        "light-grey": "#E8ECF3",
      },
    },
  },
  plugins: [],
};
