import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync, writeFileSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-manifest-and-popup",
      writeBundle() {
        // Copy manifest.json
        copyFileSync(
          resolve(__dirname, "manifest.json"),
          resolve(__dirname, "dist/manifest.json")
        );
        // Copy popup.html
        mkdirSync(resolve(__dirname, "dist/popup"), { recursive: true });
        copyFileSync(
          resolve(__dirname, "src/popup/popup.html"),
          resolve(__dirname, "dist/popup/popup.html")
        );
        // Copy loader.js (which imports main module)
        copyFileSync(
          resolve(__dirname, "src/popup/loader-dist.js"),
          resolve(__dirname, "dist/popup/loader.js")
        );
        // Generate and copy PNG icon files
        const icon16PNG = Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwacUwAAAGJJREFUOBHt0kESwCAQw1BnrvGp0SN6glxhZkiBJPo3MwysH1o5cjjZZ4/1WXL5Q0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUP/kCwmPHwdBL0hYAAAAAElFTkSuQmCC",
          "base64"
        );
        const icon48PNG = Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwacUwAAAIZJREFUaIHt2kESwCAMhFENJ/Hpt7Cf4BGv4BiPwQkGJYRMM22HKfPxb0I3KSgIBoNBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGPyPgsFgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWD+w31sxR/YNc0AAAAASUVORK5CYII=",
          "base64"
        );
        const icon128PNG = Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADTAcBBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwacUwAAALBJREFUeIHt2kEOwCAMRFGNJ/MKnsDL4AgcwSs4gFdwBC7hFo7gCpyBKzgCt+AKbuEWXMEVXIGnmhJFVbZJQ9pWCr9ioJOQAgAAAAAA4P/btu15LMYYR9d1z7ZtH9u2vX3fx+fzGafTGZvNhs/n8xHLsj6maRrXdX19Pp/x+XzG7Xb7Oq/rOq7rGuv1+s+Jzp5sXVf/nOjsydaq1IrUitSK1IrUkpQKAAAAAAAAAPjnfUfyv1ACZI1QAiSNUAKkjFACZIxQAmSMUAJkjFACZIxQAuSMUAIAAAAAAADwX/oGC5BqxyKYW3IAAAAASUVORK5CYII=",
          "base64"
        );
        writeFileSync(resolve(__dirname, "dist/icon16.png"), icon16PNG);
        writeFileSync(resolve(__dirname, "dist/icon48.png"), icon48PNG);
        writeFileSync(resolve(__dirname, "dist/icon128.png"), icon128PNG);
      },
    },
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/popup.html"),
        main: resolve(__dirname, "src/main.tsx"),
        background: resolve(__dirname, "src/background.ts"),
      },
      external: ["loader.js"],
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "background") return "background.js";
          if (chunk.name === "main") return "src/[name].js";
          return "popup/[name].js";
        },
        chunkFileNames: "popup/assets/[name].js",
        assetFileNames: "popup/assets/[name][extname]",
      },
    },
  },
});
