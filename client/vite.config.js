import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd());

  const target =
    mode === "production"
      ? env.VITE_PRODUCTION_SERVER_URL
      : env.VITE_SERVER_URL;

  return {
    server: {
      proxy: {
        "/api": {
          target: target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
  };
});