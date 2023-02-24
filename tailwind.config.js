const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        keyframes: {
            toastInRight: {
                from: {
                    transform: "translateX(100%)",
                },
                to: {
                    transform: "translateX(0)",
                },
            },
        },
        animation: {
            "toast-in-right": "toastInRight 0.7s",
        },
        colors: {
            aqueductBlue: "#0460CE",
            defaultChart: "#4bc0c0",
            platinum: "#E9E3E6",
            taupe: "#9A8F97",
            taup: "#B1A7AE"
        },
        screens: {
            xs: "475px",
            "3xl": "2000px",
            ...defaultTheme.screens,
        },
        height: {
            screens: "200vh",
            "screen/small": "80vh",
            "screen/2": "120vh",
            "screen/3": "calc(100vh / 3)",
            "screen/4": "calc(100vh / 4)",
            "screen/5": "calc(100vh / 5)",
        },
    },
},
plugins: [],
};
