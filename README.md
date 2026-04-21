# Tickr

Tickr is a Chrome extension that helps track Ticketmaster pages and alert you when tickets appear to be available.

It monitors supported Ticketmaster event pages, retries common actions such as "Find tickets" or "Search again", and sends a Telegram message when it detects that tickets may have been found.

## Features

- Tracks Ticketmaster pages on `ticketmaster.co.uk` and `ticketmaster.com`
- Lets you start or pause tracking from the popup
- Saves your Telegram bot token and chat ID locally in Chrome storage
- Sends Telegram alerts through the background service worker
- Plays a sound and updates the page title when tickets are detected

## Project Files

- `manifest.json`: Chrome extension manifest
- `popup.html`: popup UI
- `popup.js`: popup behavior, settings, and Telegram test button
- `background.js`: sends Telegram messages through the Telegram Bot API
- `content.js`: page tracker logic that detects ticket availability and retries actions

## How It Works

1. Open the extension popup and enable tracking.
2. Add your Telegram bot token and chat ID.
3. Visit a supported Ticketmaster event page.
4. The content script checks the page continuously.
5. If tickets appear to be available, Tickr:
   - plays a short sound
   - sends a Telegram message with the page URL
   - changes the tab title to `TICKETS FOUND`

## Install Locally

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select this project folder.

## Telegram Setup

### Bot Token

1. Open Telegram.
2. Search for `@BotFather`.
3. Run `/start`.
4. Run `/newbot`.
5. Copy the bot token.

### Chat ID

1. Open Telegram.
2. Search for `@userinfobot`.
3. Press **Start**.
4. Copy your chat ID.

### Save and Test

1. Open the Tickr popup.
2. Paste your bot token and chat ID.
3. Click **Save Telegram**.
4. Click **Test Telegram** to confirm alerts are working.

## Permissions

- `storage`: stores the enabled state, Telegram token, and chat ID
- `https://api.telegram.org/*`: sends Telegram messages

## Current Notes

- The extension currently uses simple text detection to decide whether tickets are available.
- It is designed around Ticketmaster page text and button labels, so site changes may require updates.
- Telegram credentials are stored in local extension storage on the browser where the extension is installed.

## Development

After editing the project files, reload the extension in `chrome://extensions` to test changes.
