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
          50: "#F4F8F3",
          100: "#E9F1E8",
          200: "#C9DCC5",
          300: "#A8C7A1",
          400: "#669E5B",
          500: "#257415",
          600: "#216813",
          700: "#16460D",
          800: "#113409",
          900: "#0B2306",
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
