import { createCanvas } from "canvas";
import { writeFileSync } from "fs";
import { resolve } from "path";

// Function to create an icon
function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Green background
  ctx.fillStyle = "#34A853";
  ctx.fillRect(0, 0, size, size);
  ctx.roundRect(0, 0, size, size, size / 8);
  ctx.fill();

  // Spreadsheet grid
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = size / 24;

  const gridStart = size * 0.15;
  const gridEnd = size * 0.85;
  const cellSize = (gridEnd - gridStart) / 3;

  // Horizontal lines
  for (let i = 1; i < 4; i++) {
    const y = gridStart + i * cellSize;
    ctx.beginPath();
    ctx.moveTo(gridStart, y);
    ctx.lineTo(gridEnd, y);
    ctx.stroke();
  }

  // Vertical lines
  for (let i = 1; i < 3; i++) {
    const x = gridStart + i * cellSize;
    ctx.beginPath();
    ctx.moveTo(x, gridStart);
    ctx.lineTo(x, gridEnd);
    ctx.stroke();
  }

  // Orange plus circle
  const plusX = gridEnd + size * 0.05;
  const plusY = gridEnd + size * 0.05;
  const plusRadius = size / 8;

  ctx.fillStyle = "#FF6F00";
  ctx.beginPath();
  ctx.arc(plusX, plusY, plusRadius, 0, Math.PI * 2);
  ctx.fill();

  // Plus sign
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = size / 20;
  ctx.lineCap = "round";

  // Vertical line
  ctx.beginPath();
  ctx.moveTo(plusX, plusY - plusRadius / 2);
  ctx.lineTo(plusX, plusY + plusRadius / 2);
  ctx.stroke();

  // Horizontal line
  ctx.beginPath();
  ctx.moveTo(plusX - plusRadius / 2, plusY);
  ctx.lineTo(plusX + plusRadius / 2, plusY);
  ctx.stroke();

  return canvas.toBuffer("image/png");
}

// Create icons
const sizes = [16, 48, 128];
sizes.forEach((size) => {
  const buffer = createIcon(size);
  writeFileSync(resolve(__dirname, `../dist/icon${size}.png`), buffer);
  console.log(`Created icon${size}.png`);
});
