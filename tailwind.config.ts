import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        input: {
          DEFAULT: "#F6F8F9",
        },
        button: {
          primary: "#007BFF",
          secondary: "#F2F8FF",
        },
        brand: {
          1: "#00050A",
          2: "#354959",
          3: "#808D97",
          "btn-primary": "#FFFFFF",
          "btn-secondary": "#001933",
          "accent-2": "#007BFF",
          'bkg-1': '#001933',
          
        },
        blue: {
          "400": "#F2F8FF",
          "500": "#6A7181",
          "600": "#4A5564",
          "700": "#3A414E",
          "800": "#252A31",
          "900": "#181B20",
          DEFAULT: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
} as Config;
