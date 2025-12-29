# Flipkart Data Fetcher

A Chrome extension that fetches and logs data from Flipkart product pages.

## Description

This extension is designed to extract data from Flipkart.com pages and log it to the browser console for analysis and inspection.

## Features

- Content script for Flipkart data extraction
- Automatic data fetching on Flipkart pages
- Console logging for data inspection

## Installation

1. Load the extension in Chrome by going to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" and select this directory

## How It Works

- The extension injects a content script on all Flipkart pages (`https://*.flipkart.com/*`)
- Data is automatically extracted and logged to the browser console
- Open DevTools (F12) to view the logged data

## Files

- `manifest.json` - Extension configuration
- `content-script.js` - Script that extracts and logs Flipkart data

## Usage

1. Navigate to any Flipkart.com page
2. Open DevTools (F12 or Ctrl+Shift+I)
3. Go to the Console tab
4. View the logged data from the extension

## Version

1.0.0
