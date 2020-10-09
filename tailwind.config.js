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
          50: "#F2F9F6",
          100: "#E6F3ED",
          200: "#BFE0D3",
          300: "#99CEB8",
          400: "#4DA983",
          500: "#6246EA",
          600: "#007746",
          700: "#004F2F",
          800: "#2C2069",
          900: "#002817",
        },
      },
    },
  },
};
