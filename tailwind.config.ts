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
        },
        brand: {
          1: "#00050A",
          2: "#354959",
          3: "#808D97",
          "btn-primary": "#FFFFFF",
          "btn-secondary": "#001933",
          "accent-2": "#007BFF",
          "bkg-1": "#001933",
          "bkg-2": "#CED8E3",
          "bkg-3": "#FFF7F2",
        },
        blue: {
          "dark-100": "#0B3D72",
          "200": "#007BFF",
          "400": "#F2F8FF",
          "500": "#6A7181",
          "600": "#4A5564",
          "700": "#3A414E",
          "800": "#252A31",
          "900": "#181B20",
          action: "#0073C4",
          DEFAULT: "#FFFFFF",
        },
        grey: {
          "200": "#354959",
          "300": "#808D97",
          "400": "#F2F3F5",
        },
        green: {
          DEFAULT: "#F6FBF5",
        },
        red: {
          light: "#FFF4F4",
        },
      },
    },
  },
  plugins: [],
} as Config;
