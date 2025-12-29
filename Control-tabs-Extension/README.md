# Control Tabs Extension

A Chrome extension that helps you manage and close multiple browser tabs efficiently.

## Description

This extension displays a list of all open tabs in a popup window with checkboxes, allowing you to selectively close multiple tabs at once. Perfect for managing tab clutter.

## Features

- View all open tabs in popup
- Checkbox selection for multiple tabs
- Bulk close functionality
- Clean and intuitive UI

## Installation

1. Load the extension in Chrome by going to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" and select this directory

## How It Works

- Click the extension icon to open the popup
- All currently open tabs are displayed with checkboxes
- Select the tabs you want to close
- Click the close button to remove selected tabs

## Files

- `manifest.json` - Extension configuration
- `popup.html` - Popup interface
- `background.js` - Service worker for managing tabs
- `icons/icon-48.png` - Extension icon

## Permissions

- `tabs` - To list and close tabs

## Usage

1. Click the Control Tabs icon in your toolbar
2. Check the boxes next to tabs you want to close
3. Click the action button to close them

## Version

1.0.0
