# Accessibility Toolkit - Chrome Extension

A comprehensive Chrome extension designed to improve web accessibility for elderly and visually impaired users. The extension provides quick-access tools to adjust text size, contrast, colors, and offer magnification and text-to-speech features.

## 🎯 Features

### Visual Accessibility

- **Text Size**: Enlarge text by 40% for better readability
- **Bold Text**: Increase font weight for clearer visibility
- **High Contrast**: Boost contrast by 180% to improve text distinction
- **Grayscale**: Apply grayscale filter to reduce visual complexity
- **Invert Colors**: Invert page colors for inverted display preferences
- **Hide Images**: Remove images from the page to focus on text
- **Highlight Links**: Highlight all links with yellow background for quick identification
- **Cursor Options**: Black or white cursor for improved visibility

### Interactive Features

- **Magnifier**: Lens-style magnifier that follows your cursor with 2x zoom for focused content reading
- **Text-to-Speech**: Read selected text aloud with customizable voice and playback rate
- **Seizure Safe**: Disable animations and transitions to prevent motion-triggered issues

### Smart Settings

- **Persistent Storage**: All accessibility settings are saved and automatically applied across all open tabs
- **One-Click Reset**: Instantly revert all settings to defaults
- **Voice Selection**: Choose from system-available voices for text-to-speech
- **Rate Control**: Adjust speech playback speed (0.5x to 2x)

## 📦 Installation

### From Source (Development)

1. **Clone or extract the project**

   ```bash
   cd Accessibilty-extension
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the extension**

   ```bash
   npm run build
   ```

4. **Load in Chrome**

   - Open `chrome://extensions/`
   - Enable **Developer mode** (top-right toggle)
   - Click **Load unpacked**
   - Select the project folder

5. **Verify Installation**
   - You should see "Accessibility Toolkit" listed in extensions
   - Pin the extension icon to the toolbar for quick access

## 🚀 Usage

### Accessing the Popup

1. Click the **Accessibility Toolkit** icon in the Chrome toolbar
2. The popup will display 6 feature buttons and TTS controls

### Toggle Features

- Click any button to enable/disable that accessibility feature
- Active buttons are highlighted (blue background)
- Features apply to **all open tabs** instantly

### Text-to-Speech

1. Select text on any webpage
2. Open the extension popup
3. Choose a voice from the **Speech** dropdown (optional)
4. Adjust playback rate with the slider (0.5x to 2x speed)
5. The selected text will be read aloud in the chosen voice

### Magnifier (Lens Style)

1. Click the **Zoom** button to enable the magnifier
2. Move your cursor around the page—a circular 2x magnified view follows your cursor
3. Click **Zoom** again to disable

### Reset

- Click the **Reset** button (red) to clear all accessibility settings at once

## 🏗️ Project Structure

```
Accessibilty-extension/
├── manifest.json              # Extension configuration & permissions
├── package.json               # Node dependencies & build scripts
├── vite.config.ts             # Vite build configuration
├── README.md                  # This file
├── scripts/
│   └── copy-popup.js          # Post-build script to copy popup HTML and fix paths
├── src/
│   ├── types.ts               # TypeScript type definitions for Settings
│   ├── background/
│   │   └── background.ts      # Background service worker (persistence & auto-apply)
│   ├── content/
│   │   ├── content.ts         # Content script (applies settings & handles magnifier/TTS)
│   │   └── accessibility.css  # CSS classes for all accessibility features
│   └── popup/
│       ├── popup.html         # Popup UI structure
│       ├── popup.css          # Popup styling (stacked button layout)
│       ├── popup.js           # Popup logic (messaging, storage, UI updates)
│       ├── main.tsx           # (Legacy React entry, not used in current build)
│       └── App.tsx            # (Legacy React component, not used in current build)
└── dist/                      # Built extension output
    ├── popup.html             # Built & copied popup
    ├── popup.js               # Built popup script
    ├── popup.css              # Built popup styles
    ├── background.js          # Built background script
    ├── content.js             # Built content script
    └── ...
```

## 🔧 Development

### Building

```bash
npm run build
```

This runs Vite to bundle all files, then the postbuild script copies and fixes the popup HTML for extension compatibility.

### Watch Mode

```bash
npm run dev
```

Starts Vite in development mode (optional; still need to reload extension manually in Chrome).

### File Changes & Reloading

After making changes:

1. Run `npm run build`
2. Go to `chrome://extensions/`
3. Click the refresh (⟳) button on "Accessibility Toolkit"
4. Test on any webpage

## 📋 How It Works

### Architecture

- **Popup** (`popup.js`): Sends settings to all open tabs when user toggles buttons
- **Background Service Worker** (`background.ts`): Listens for tab changes and auto-applies stored settings to new tabs
- **Content Script** (`content.ts`): Receives messages, applies CSS classes, and handles magnifier + TTS actions
- **Storage** (`chrome.storage.sync`): Persists settings across browser sessions and syncs them across devices (if user is signed in)

### Message Flow

1. User clicks button in popup
2. Popup queries all tabs and sends settings message to each
3. Content script receives message and applies CSS classes or triggers actions
4. Settings stored in `chrome.storage.sync` for persistence

### Magnifier Implementation

- Creates a circular DOM element that clones the page content at 2x scale
- Follows cursor with event listeners to provide focused magnification
- Removes on toggle to clean up DOM and event listeners

### Text-to-Speech

- Uses Web Speech API (`SpeechSynthesisUtterance`)
- Respects user-chosen voice and playback rate from popup settings
- Reads selected text with `window.getSelection()`

## 🔐 Permissions

The extension requests the following permissions:

- **`storage`**: To save settings (sync storage for cross-device persistence)
- **`activeTab`**: To access the currently active tab
- **`scripting`**: To inject content scripts
- **`tabs`**: To query all open tabs and send messages to them

## ⚙️ Browser Compatibility

- **Chrome**: Full support (Manifest V3)
- **Edge**: Should work (uses Chromium)
- **Other Chromium browsers**: May work with minor adjustments

## 🐛 Known Limitations

- Magnifier does not work on pages with heavy iframes or shadow DOM (performance consideration)
- Text-to-Speech availability depends on system language and installed voices
- Some websites with strict Content Security Policies may block CSS modifications
- Chrome-specific pages (`chrome://`, `chrome-extension://`) cannot be accessed

## 📝 Future Enhancements

- [ ] Support for more languages and localization
- [ ] Adjustable magnifier size and zoom level
- [ ] Letter spacing and line height controls
- [ ] Custom color schemes (dark mode, sepia, etc.)
- [ ] Keyboard shortcuts for quick feature access
- [ ] Hotkeys to toggle features without opening popup
- [ ] Performance optimizations for magnifier on heavy pages

## 🤝 Contributing

To contribute:

1. Fork or clone the repository
2. Make changes in `src/`
3. Run `npm run build` to test
4. Reload the extension in Chrome to verify
5. Submit a pull request with a clear description

## 📄 License

This project is provided as-is for accessibility improvement purposes.

## 🙏 Credits

Built with:

- [Vite](https://vitejs.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Chrome Extensions API](https://developer.chrome.com/docs/extensions/) - Extension capabilities
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Text-to-speech

---

**For accessibility support or feature requests, please open an issue on the project repository.**
