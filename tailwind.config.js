export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes').light,
          primary: "#6B1868",
          secondary: "#EF2F24"
        }
      }
    ]
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}