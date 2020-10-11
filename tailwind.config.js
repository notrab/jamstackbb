const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.js"],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          50: "#F4F7FD",
          100: "#E9EFFA",
          200: "#C8D8F4",
          300: "#A7C0ED",
          400: "#6591DF",
          500: "#2362D1",
          600: "#2058BC",
          700: "#153B7D",
          800: "#102C5E",
          900: "#0B1D3F",
        },
      },
    },
  },
  variants: {
    backgroundColor: ({ after }) => after(["group-hover"]),
    textColor: ({ after }) => after(["group-hover"]),
    opacity: ({ after }) => after(["group-hover"]),
  },
};
