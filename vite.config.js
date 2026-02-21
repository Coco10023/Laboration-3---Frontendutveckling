import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/Laboration-3---Frontendutveckling/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        sass: resolve(__dirname, "sass.html"),
        animering: resolve(__dirname, "animering.html"),
        diagram: resolve(__dirname, "diagram.html"),
        karta: resolve(__dirname, "karta.html"),
      },
    },
  },
});
