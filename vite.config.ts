import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import express from "express";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",

  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./", "./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
  },

  build: {
    outDir: "dist/spa",
  },

  plugins: [react(), expressPlugin()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = express();
      
      // Middleware básico
      app.use((req, res, next) => {
        console.log(`[Express] ${req.method} ${req.url}`);
        next();
      });
      
      server.middlewares.use(app);
    },
  };
}