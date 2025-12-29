import { useEffect, useState } from "react";
import { Settings } from "../types";

const defaultSettings: Settings = {
  bigText: false,
  boldText: false,
  highContrast: false,
  grayscale: false,
  invert: false,
  hideImages: false,
  highlightLinks: false,
  blackCursor: false,
  whiteCursor: false,
  seizureSafe: false,
};

export default function App() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    chrome.storage.sync.get("settings", (data) => {
      if (data.settings) setSettings(data.settings);
    });
  }, []);

  const toggle = (key: keyof Settings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);

    chrome.storage.sync.set({ settings: updated });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) chrome.tabs.sendMessage(tabs[0].id, updated);
    });
  };

  const toggleMagnifier = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id)
        chrome.tabs.sendMessage(tabs[0].id, { action: "magnifier-toggle" });
    });
  };

  const speakSelection = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id)
        chrome.tabs.sendMessage(tabs[0].id, { action: "speak-selection" });
    });
  };

  return (
    <div>
      <h3>Accessibility Toolkit</h3>
      <div style={{ marginBottom: 8 }}>
        <button onClick={toggleMagnifier}>Toggle Magnifier</button>
        <button onClick={speakSelection} style={{ marginLeft: 8 }}>
          Speak Selection
        </button>
      </div>
      {Object.keys(settings).map((k) => (
        <label key={k}>
          <input
            type="checkbox"
            checked={settings[k as keyof Settings]}
            onChange={() => toggle(k as keyof Settings)}
          />
          {k}
        </label>
      ))}
    </div>
  );
}
