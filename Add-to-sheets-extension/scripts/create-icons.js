#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Base64 encoded PNG icons (1x1 transparent, then proper icons)
// These are minimal valid PNG files with the icon design

const icon16Base64 =
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOElEQVR4nGP8//8/A4UFNQYN/M+gxsDAQJeGgYGBgUGQBhYGBiYGAaoH0sDAQJeGgYGBgUGQBhYGBgYAKuAKTXjN94UAAAAASUVORK5CYII=";
const icon48Base64 =
  "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAzklEQVRoge3YQQqCQBCG4VkTL7kHe7wFXryEYN5C8BaWt+jgjmEuWbCw6M4ELfPPN8PAz3wz37AiIiIiIiL+a7PZjOv1+r/Y7XY/XW6328/tdhuW5TFyuRyXy+X/YpqmYRgGx+Pxf7FcLofZbAaAYRh8PB7jcDi8f/PpdBrm8zljsRjpdJqtra28vLz8l+P2+z0Ui0XKZLI4jkOhUACgUqkwm8348OCcw+Hwf2AwGDCdTkmnf1+VarUaAMVikUq1SiKRoFwuY9s2JDLH45H37++FQgEAjPPvzXHcf/H5+cloNKJarVIsFv9lFRERERERERHxD1s5X3oXD0hZAAAAAElFTkSuQmCC";
const icon128Base64 =
  "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADTAcBBAAAA4klEQVR4nO3bQQrDIBBAwVdI73nxBL1YDxFvkJP0VKGbpFUkM8OA8MHnPwEAAAAAAAAAAAAAAAAAAAAAAAAAAOA/t9vtZlmWY1mWXq9X1u/3s/F4nJ3P56zb7WbLdTqdZoPB4E9xFotFNhwOs/f7nRWLxWw+n2fD4fCP+Pz8zK7X6x+Yl8vljwjXdZn3+51lWZZ9f39n+Xz+X+pDOBwOs5+fn/j6+oqPx2Pcf39/8e/vL97d3eHj4wPn8zk+n8/YarVw/PyQ8Xx+P+bxeIzX6/Uv9SEAgPdxOp2eHgMATNXr9XoaAADMVVEUTwMAGKeKonh6DAAAfJH7ff+0GAAA+G9cLheniZHJZJJ5npcZjcaZYRjZxeJz5d/FYjFbLpfZcrmMp9Pp6TsAAAAAAAAAAAAAAAAAAAAAAAAA/scf5VhvR8mjWaQAAAAASUVORK5CYII=";

// Write PNG files
fs.writeFileSync(
  path.join(__dirname, "../dist/icon16.png"),
  Buffer.from(icon16Base64, "base64")
);
fs.writeFileSync(
  path.join(__dirname, "../dist/icon48.png"),
  Buffer.from(icon48Base64, "base64")
);
fs.writeFileSync(
  path.join(__dirname, "../dist/icon128.png"),
  Buffer.from(icon128Base64, "base64")
);

console.log("Icons generated successfully");
