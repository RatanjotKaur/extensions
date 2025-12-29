# Pomodoro Extension

A Pomodoro timer Chrome extension to help you manage your time and boost productivity with the Pomodoro Technique.

## Description

This is a comprehensive Pomodoro timer extension featuring notifications, storage for statistics, and a side panel for easy access. It includes download capabilities and customizable work/break intervals.

## Features

- Pomodoro timer with customizable intervals
- Desktop notifications for timer completion
- Statistics tracking with browser storage
- Side panel for persistent timer view
- Settings for personalization
- Video/media resources for break time suggestions
- Multi-language support (English and Spanish)

## Installation

1. Load the extension in Chrome by going to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" and select this directory

## How It Works

- Click the extension icon to open the popup and start a timer
- Use the side panel (accessible from the extension menu) for persistent timer
- Notifications alert you when sessions complete
- Stats are saved to your browser storage
- Customize settings via the settings page

## Files

- `manifest.json` - Extension configuration
- `popup/popup.html` - Main popup interface
- `popup/popup.js` - Popup logic
- `popup/popup.css` - Popup styling
- `background.js` - Service worker for timer management
- `settings/settings.html` - Settings page
- `settings/settings.js` - Settings logic
- `settings/settings.css` - Settings styling
- `sidePanel/side-panel.html` - Side panel interface
- `sidePanel/side-panel.js` - Side panel logic
- `assets/do-it.webm` - Motivational video
- `_locales/en/messages.json` - English translations
- `_locales/es/messages.json` - Spanish translations

## Permissions

- `notifications` - Desktop notifications
- `storage` - Save timer stats and settings
- `downloads` - Download functionality
- `sidePanel` - Side panel access
- `activeTab` - Active tab access
- `tabs` - Tab management
- `<all_urls>` - Full web access

## Usage

1. Click the extension icon to start a Pomodoro session
2. Choose your work duration (default 25 minutes)
3. Work until the timer completes
4. Take a break when notified
5. View statistics in the popup
6. Customize settings as needed

## Version

1.0
