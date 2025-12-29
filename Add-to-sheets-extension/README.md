# Add to Google Sheets Extension

A Chrome extension that integrates with Google Sheets to append tags and data using the Google Sheets API.

## Description

This extension provides functionality to verify sheets and append tags/data using the Google Sheets API. It requires Google authentication to access your sheets.

## Features

- Google Sheets API integration
- Append tags to sheets
- Popup interface for easy access
- Google authentication

## Installation

1. Load the extension in Chrome by going to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" and select this directory
4. Authenticate with your Google account when prompted

## Permissions

- `identity` - For Google authentication
- `storage` - To store user preferences
- Host permissions for `sheets.googleapis.com` and `googleapis.com`

## Files

- `popup/popup.html` - Main popup interface
- `background.js` - Service worker for handling API calls
- `manifest.json` - Extension configuration

## Usage

1. Click the extension icon to open the popup
2. Authenticate with your Google account
3. Select a sheet and append data as needed

## Version

1.0
