# Hello Extensions

A base-level Chrome extension demonstrating fundamental extension concepts.

## Description

This is a starter extension that demonstrates basic Chrome extension functionality including content scripts and web accessible resources.

## Features

- Content script injection
- Web accessible resources
- Google.com integration

## Installation

1. Load the extension in Chrome by going to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" and select this directory

## How It Works

- The extension injects a content script on Google.com (`https://*.google.com/*`)
- It has access to a logo image as a web-accessible resource

## Files

- `manifest.json` - Extension configuration
- `content-script.js` - Script injected into web pages
- `images/logo.png` - Web accessible resource

## Usage

Navigate to any Google.com page and the content script will be active.

## Version

1.0.0
