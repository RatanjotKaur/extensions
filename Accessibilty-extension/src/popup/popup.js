const defaultSettings = {
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

function sendSettingsToAllTabs(settings) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (!tab.id) return;
      chrome.tabs.sendMessage(tab.id, settings, () => {
        // Suppress errors if content script not loaded (e.g., on chrome:// pages)
        if (chrome.runtime.lastError) {
          // Error is expected on pages without content script; silently ignore
        }
      });
    });
  });
}

function updateStorage(settings) {
  chrome.storage.sync.set({ settings });
}

function toggleKey(key) {
  chrome.storage.sync.get("settings", (data) => {
    const settings = Object.assign({}, defaultSettings, data.settings || {});
    settings[key] = !settings[key];
    updateStorage(settings);
    sendSettingsToAllTabs(settings);
    updateButtons(settings);
  });
}

function updateButtons(settings) {
  document
    .getElementById("bigText")
    .classList.toggle("active", !!settings.bigText);
  document
    .getElementById("contrast")
    .classList.toggle("active", !!settings.highContrast);
  document
    .getElementById("grayscale")
    .classList.toggle("active", !!settings.grayscale);
  document
    .getElementById("hideImages")
    .classList.toggle("active", !!settings.hideImages);
  document
    .getElementById("zoom")
    .classList.toggle("active", !!settings.magnifier);
}

// TTS controls
function populateVoices(selectEl) {
  const voices = speechSynthesis.getVoices();
  selectEl.innerHTML = "";
  voices.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v.name;
    opt.textContent = `${v.name} (${v.lang})`;
    selectEl.appendChild(opt);
  });
}

function initTTSControls() {
  const voiceSelect = document.getElementById("ttsVoice");
  const rateInput = document.getElementById("ttsRate");
  if (!voiceSelect || !rateInput) return;

  const afterVoices = () => {
    populateVoices(voiceSelect);
    chrome.storage.sync.get(["ttsVoice", "ttsRate"], (data) => {
      if (data.ttsVoice) voiceSelect.value = data.ttsVoice;
      if (data.ttsRate) rateInput.value = data.ttsRate;
    });
  };

  // voices may load asynchronously
  populateVoices(voiceSelect);
  window.speechSynthesis.onvoiceschanged = afterVoices;

  voiceSelect.addEventListener("change", () => {
    chrome.storage.sync.set({ ttsVoice: voiceSelect.value });
  });

  rateInput.addEventListener("input", () => {
    chrome.storage.sync.set({ ttsRate: parseFloat(rateInput.value) });
  });
}

function resetAll() {
  updateStorage(defaultSettings);
  sendSettingsToAllTabs(defaultSettings);
  updateButtons(defaultSettings);
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("bigText")
    .addEventListener("click", () => toggleKey("bigText"));
  document
    .getElementById("contrast")
    .addEventListener("click", () => toggleKey("highContrast"));
  document
    .getElementById("grayscale")
    .addEventListener("click", () => toggleKey("grayscale"));
  document
    .getElementById("hideImages")
    .addEventListener("click", () => toggleKey("hideImages"));
  document.getElementById("zoom").addEventListener("click", () => {
    // magnifier is handled as an action, but keep a stored flag for UI
    chrome.storage.sync.get("settings", (data) => {
      const settings = Object.assign({}, defaultSettings, data.settings || {});
      settings.magnifier = !settings.magnifier;
      updateStorage(settings);
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (!tab.id) return;
          chrome.tabs.sendMessage(
            tab.id,
            { action: "magnifier-toggle" },
            () => {
              if (chrome.runtime.lastError) {
                // Error is expected on pages without content script; silently ignore
              }
            }
          );
        });
      });
      updateButtons(settings);
    });
  });
  document.getElementById("reset").addEventListener("click", resetAll);

  // initialize UI from storage
  chrome.storage.sync.get("settings", (data) => {
    const settings = Object.assign({}, defaultSettings, data.settings || {});
    updateButtons(settings);
  });

  // init TTS controls if present
  initTTSControls();
});
