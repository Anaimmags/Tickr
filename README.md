# Tickr

Tickr is a Chrome extension for monitoring supported Ticketmaster pages and alerting you when tickets may be available.

It can:

- watch supported Ticketmaster pages
- retry common actions like `Find tickets` or `Search again`
- play a sound when tickets are detected
- send a Telegram alert to your phone
- change the tab title to `TICKETS FOUND`

When Ticketmaster reserves tickets, the hold is usually around 1 minute 30 seconds, so the alert is meant to give you enough time to complete checkout.

## What You Need

Before installing Tickr, make sure you have:

- Google Chrome
- a Telegram account
- a Telegram bot token
- your Telegram chat ID

## Download From GitHub

If you are sharing this repo with someone, these are the easiest steps for them:

1. Open the GitHub repository.
2. Click the green `Code` button.
3. Click `Download ZIP`.
4. Unzip the downloaded folder somewhere easy to find.

If they know Git, they can also clone it:

```bash
git clone https://github.com/Anaimmags/Tickr.git
```

## Install In Chrome

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Turn on `Developer mode` in the top right.
4. Click `Load unpacked`.
5. Select the unzipped `Tickr` folder.
6. The Tickr icon should now appear in Chrome.

If you update the files later, go back to `chrome://extensions` and click `Reload` on the Tickr extension.

## Telegram Setup

Tickr uses Telegram for alerts.

### Step 1: Create a Telegram bot

1. Open Telegram.
2. Search for `@BotFather`.
3. Press `Start`.
4. Send `/newbot`.
5. Follow the instructions to create your bot.
6. Copy the bot token that BotFather gives you.

### Step 2: Get your chat ID

1. Open Telegram.
2. Search for `@userinfobot`.
3. Press `Start`.
4. Copy the chat ID shown in the chat.

### Step 3: Save details in Tickr

1. Click the Tickr extension icon in Chrome.
2. Paste your bot token into `Telegram Bot Token`.
3. Paste your chat ID into `Chat ID`.
4. Click `Save Telegram`.
5. Click `Test Telegram`.

If the setup is correct, you should receive a test message in Telegram.

## How To Use Tickr

1. Open a supported Ticketmaster event page.
2. Click the Tickr extension icon.
3. Click `Start tracking`.
4. Leave the tab open while Tickr checks the page.

If tickets are detected, Tickr can:

- play a sound alert
- send a Telegram message with the current page URL
- change the tab title to `TICKETS FOUND`

If Ticketmaster reserves tickets, move quickly. The hold is usually only about 1 minute 30 seconds.

## Supported Sites

- `https://www.ticketmaster.co.uk/*`
- `https://www.ticketmaster.com/*`

## Permissions

Tickr currently uses:

- `storage`
  Saves whether tracking is enabled, plus the Telegram bot token and chat ID in local browser storage.
- `https://api.telegram.org/*`
  Lets the extension send Telegram messages through the Telegram Bot API.

## Troubleshooting

### Telegram test does not work

Check the following:

- your bot token is correct
- your chat ID is correct
- you clicked `Save Telegram` before testing
- you started the bot or opened the Telegram chat first

### Chrome does not show the extension

- Make sure you selected the project folder itself when using `Load unpacked`
- Go to `chrome://extensions` and click `Reload`
- Check for errors shown on the Tickr extension card

### Ticketmaster says "Your Browsing Activity Has Been Paused"

If Ticketmaster shows that message:

- stop the tracker
- do not keep refreshing repeatedly
- sign in on one device only
- switch network, device, or location if Ticketmaster tells you to
- wait and try again later manually

## Project Files

- `manifest.json`: Chrome extension manifest
- `popup.html`: popup interface
- `popup.js`: popup logic and Telegram setup
- `background.js`: Telegram sending logic
- `content.js`: Ticketmaster page tracking logic
- `icons/`: extension icon assets

## Share This Repo

If you want to send this to people from Reddit or anywhere else, send them the GitHub repo link and tell them:

1. Download the repo as a ZIP from GitHub.
2. Unzip it.
3. Open `chrome://extensions`.
4. Turn on `Developer mode`.
5. Click `Load unpacked`.
6. Select the Tickr folder.
7. Set up Telegram inside the extension popup.

Short version you can paste:

```text
Install steps:
1. Open the GitHub repo
2. Click Code > Download ZIP
3. Unzip it
4. In Chrome, open chrome://extensions
5. Turn on Developer mode
6. Click Load unpacked
7. Select the Tickr folder
8. Open the extension and add your Telegram bot token + chat ID
```

## Notes

- Tickr uses simple page-text detection, so if Ticketmaster changes its page structure, the extension may need updates.
- Telegram credentials are stored locally in the browser profile where the extension is installed.
- This project is currently shared as an unpacked Chrome extension, not through the Chrome Web Store.
