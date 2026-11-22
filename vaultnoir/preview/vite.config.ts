import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// The wrappers live outside this folder (../react, ../icons): resolve react from here.
const nm = (p: string) => fileURLToPath(new URL(`./node_modules/${p}`, import.meta.url));
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { react: nm("react"), "react-dom": nm("react-dom") } },
  server: { fs: { allow: [".."] } },
});
