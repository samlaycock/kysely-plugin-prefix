import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Kysely Prefix Plugin",
      formats: ["es", "cjs"],
      fileName: (format) =>
        `index.${format}.${format === "cjs" ? "js" : "mjs"}`,
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.devDependencies),
      ],
    },
  },
});
