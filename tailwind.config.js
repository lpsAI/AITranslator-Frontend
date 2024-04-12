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
          primary: "#B38BB2", 
          secondary: "#DA837F", 
          bg: "#F0F0F0",  // Light gray
          "bg-contrast": "#FFFFFF",  // White
          text: "#333333",  // Dark gray
          "text-contrast": "#FFFFFF",  // White
          "border-base": "#CCCCCC",  // Light gray
          "border-primary": "#4B0082",  // Dark purple
          "border-secondary": "#6A5ACD",  // Medium purple
          "border-accent": "#FFD700",  // Gold
          "border-error": "#FF6347",  // Tomato
          "btn-primary": "#4B0082",  // Dark purple
          "btn-secondary": "#6A5ACD",  // Medium purple
          "btn-error": "#FF6347",  // Tomato
          "placeholder-primary": "#000000",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#6B1868",  
          secondary: "#71120D",  
          bg: "#333333",  // Dark gray
          "bg-contrast": "#1A1A1A",  // Darker gray
          text: "#FFFFFF",  // White
          "text-contrast": "#FFFFFF",  // White
          "border-base": "#666666",  // Gray
          "border-primary": "#6A5ACD",  // Medium purple
          "border-secondary": "#4B0082",  // Dark purple
          "border-accent": "#FFD700",  // Gold
          "border-error": "#FF6347",  // Tomato
          "btn-primary": "#6A5ACD",  // Medium purple
          "btn-secondary": "#4B0082",  // Dark purple
          "btn-error": "#FF6347",  // Tomato
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
