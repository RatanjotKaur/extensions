import React from "react"; // works after tsconfig fix
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root");
const root = createRoot(rootEl);
root.render(<App />);
