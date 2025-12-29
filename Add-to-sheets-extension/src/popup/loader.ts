// Popup loader - imports the main module
import("/src/main.tsx").catch((err) =>
  console.error("Failed to load main module:", err)
);
