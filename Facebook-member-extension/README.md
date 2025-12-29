# Facebook Member Request Logger

A Chrome extension that captures Facebook Group member requests and automatically saves them to Google Sheets.

## Description

This extension monitors Facebook group member requests and logs them to a Google Sheet via the Google Sheets API. Perfect for group administrators who need to track membership requests.

## Features

- Automatically captures Facebook group member requests
- Integrates with Google Sheets API
- OAuth2 authentication with Google
- Monitors member request pages and member lists
- Popup interface for configuration

## Installation

1. Load the extension in Chrome by going to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" and select the `public/` directory
4. Authenticate with your Google account when prompted

## How It Works

- Content script monitors Facebook group member pages at:
  - `https://www.facebook.com/groups/*/member-requests*`
  - `https://www.facebook.com/groups/*/members*`
  - `https://www.facebook.com/groups/*/member*`
- When member requests are detected, they are captured and sent to your Google Sheet
- Data persists via browser storage

## Files

- `public/manifest.json` - Extension configuration with OAuth2
- `public/background.js` - Service worker for Google Sheets integration
- `public/content.js` - Content script for Facebook page monitoring
- `public/popup.html` - Popup interface
- `src/` - TypeScript source files

## Permissions

- `storage` - To store user data
- `scripting` - To inject scripts
- `activeTab` - To access current tab
- `identity` - For Google OAuth2 authentication
- Host permissions for `facebook.com` and `sheets.googleapis.com`

## Setup

1. Install the extension from the `public/` directory
2. Click the extension icon to authenticate with Google
3. Navigate to a Facebook group member requests page
4. The extension will automatically log requests to your configured Google Sheet

## Version

1.0
