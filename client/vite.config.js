import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef, no-unused-vars
  const env = loadEnv(mode, process.cwd());

  const target =
    mode === "production"
      ? "https://meet-me-backend.onrender.com/"
      : "http://127.0.0.1:8000";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: target,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
