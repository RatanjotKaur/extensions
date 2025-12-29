import { Settings } from "../types";

const root = document.documentElement;

function applySettings(settings: Settings) {
  root.classList.toggle("big-text", settings.bigText);
  root.classList.toggle("bold-text", settings.boldText);
  root.classList.toggle("high-contrast", settings.highContrast);
  root.classList.toggle("grayscale", settings.grayscale);
  root.classList.toggle("invert", settings.invert);
  root.classList.toggle("hide-images", settings.hideImages);
  root.classList.toggle("highlight-links", settings.highlightLinks);
  root.classList.toggle("black-cursor", settings.blackCursor);
  root.classList.toggle("white-cursor", settings.whiteCursor);
  root.classList.toggle("seizure-safe", settings.seizureSafe);
}

let magnifierEnabled = false;

// Magnifier elements/state
let lens: HTMLDivElement | null = null;
let lensClone: HTMLElement | null = null;
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

function createLens() {
  if (lens) return;
  lens = document.createElement("div");
  lens.id = "mgl-lens";
  lens.style.position = "fixed";
  lens.style.width = "180px";
  lens.style.height = "180px";
  lens.style.borderRadius = "50%";
  lens.style.overflow = "hidden";
  lens.style.pointerEvents = "none";
  lens.style.zIndex = "2147483647";
  lens.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";

  lensClone = document.documentElement.cloneNode(true) as HTMLElement;
  // remove the lens itself from the clone to avoid recursion
  const existingLens = lensClone.querySelector("#mgl-lens");
  if (existingLens && existingLens.parentNode)
    existingLens.parentNode.removeChild(existingLens);

  lensClone.style.transform = "scale(2)";
  lensClone.style.transformOrigin = "0 0";
  lensClone.style.position = "absolute";
  lensClone.style.top = "0";
  lensClone.style.left = "0";
  lensClone.style.width = window.innerWidth + "px";
  lensClone.style.height = window.innerHeight + "px";

  lens.appendChild(lensClone);
  document.body.appendChild(lens);

  mouseMoveHandler = (e: MouseEvent) => {
    if (!lens || !lensClone) return;
    const rect = lens.getBoundingClientRect();
    const cx = e.clientX;
    const cy = e.clientY;
    lens.style.left = cx - rect.width / 2 + "px";
    lens.style.top = cy - rect.height / 2 + "px";

    // position the cloned content so the point under cursor remains centered
    const scale = 2;
    const tx = -cx * scale + rect.width / 2;
    const ty = -cy * scale + rect.height / 2;
    lensClone.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  };

  window.addEventListener("mousemove", mouseMoveHandler);
}

function removeLens() {
  if (mouseMoveHandler)
    window.removeEventListener("mousemove", mouseMoveHandler);
  mouseMoveHandler = null;
  if (lens && lens.parentNode) lens.parentNode.removeChild(lens);
  lens = null;
  lensClone = null;
}

chrome.runtime.onMessage.addListener((message: any, _sender, _sendResponse) => {
  if (!message) return;

  if (message.action) {
    if (message.action === "magnifier-toggle") {
      magnifierEnabled = !magnifierEnabled;
      if (magnifierEnabled) createLens();
      else removeLens();
    }

    if (message.action === "speak-selection") {
      const text = window.getSelection()?.toString()?.trim();
      if (text) {
        try {
          // load voice settings from storage
          chrome.storage.sync.get(["ttsVoice", "ttsRate"], (data) => {
            const utter = new SpeechSynthesisUtterance(text);
            if (data.ttsVoice) {
              const v = speechSynthesis
                .getVoices()
                .find((vo) => vo.name === data.ttsVoice);
              if (v) utter.voice = v;
            }
            utter.rate = data.ttsRate || 1.0;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utter);
          });
        } catch (e) {
          console.error("TTS error:", e);
        }
      }
    }

    return;
  }

  // fallback: assume message is Settings
  applySettings(message as Settings);
});
