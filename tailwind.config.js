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
        night: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#8A2BE2",  // Adjusted primary color for purple night mode
          secondary: "#4B0082",  // Adjusted secondary color for purple night mode
          bg: "#2F2F4F",  // Custom background color for purple night mode
          "bg-contrast": "#363660",  // Custom background contrast color for purple night mode
          text: "#E2E2E2",  // Custom text color for purple night mode
          "text-contrast": "#2F2F4F",  // Custom text contrast color for purple night mode
          "border-base": "#3C3C64",  // Custom border base color for purple night mode
          "border-primary": "#5D5D8A",  // Custom border primary color for purple night mode
          "border-secondary": "#8080A6",  // Custom border secondary color for purple night mode
          "border-accent": "#A1E9C5",  // Custom border accent color for purple night mode
          "border-error": "#EF4444",  // Custom border error color for purple night mode
          "btn-primary": "#8A2BE2",  // Adjusted primary button color for purple night mode
          "btn-secondary": "#4B0082",  // Adjusted secondary button color for purple night mode
          "btn-error": "#EF4444",  // Custom error button color for purple night mode
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
