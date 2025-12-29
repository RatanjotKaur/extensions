// Popup loader - imports the main module
import("../src/main.js").catch((err) =>
  console.error("Failed to load main module:", err)
);
