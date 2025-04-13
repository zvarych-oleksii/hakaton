const config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "card-dark": "rgba(14,14,20,0.5)",
        "card-white": "rgba(255, 255, 255, 0.05)",
      },
      borderColor: {
        "border-white": "rgba(255, 255, 255, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
