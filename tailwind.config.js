export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkmode: "class",
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#6B1868",
          secondary: "#EF2F24",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#c300ff",
          secondary: "#3f00ff",
          accent: "#0035ff",
          neutral: "#17040d",
          "base-100": "#292c27",
          info: "#00a8ff",
          success: "#00a300",
          warning: "#e49400",
          error: "#ff99af",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
