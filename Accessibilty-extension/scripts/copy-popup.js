import { copyFileSync, existsSync } from "fs";
import { resolve } from "path";

const root = resolve(".");
const src = resolve(root, "dist", "src", "popup", "popup.html");
const dest = resolve(root, "dist", "popup.html");

if (existsSync(src)) {
  copyFileSync(src, dest);
  console.log("Copied popup from", src, "to", dest);
} else {
  console.warn("Source popup not found:", src);
}

// Fix absolute asset paths that Vite injected (leading '/') so extension can load them
import { readFileSync, writeFileSync } from "fs";
if (existsSync(dest)) {
  let content = readFileSync(dest, "utf8");
  // replace src="/popup.js" -> src="popup.js" and href="/popup.css" -> href="popup.css"
  content = content.replace(/src=\"\//g, 'src="');
  content = content.replace(/href=\"\//g, 'href="');
  writeFileSync(dest, content, "utf8");
  console.log("Fixed asset paths in", dest);
}
