import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      api: path.resolve(__dirname, "src/api"),
      components: path.resolve(__dirname, "src/components"),
      hooks: path.resolve(__dirname, "src/hooks"),
      modals: path.resolve(__dirname, "src/modals"),
      pages: path.resolve(__dirname, "src/pages"),
      providers: path.resolve(__dirname, "src/providers"),
      types: path.resolve(__dirname, "src/types"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  define: {
    global: {},
  },
});
