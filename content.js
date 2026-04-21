// ======================
// Tickr Tracker
// ======================

let isRunning = false;
let lastNotification = 0;
let nextRunTimer = null;

const NEGATIVE_AVAILABILITY_PHRASES = [
  "there aren’t enough tickets",
  "there aren't enough tickets",
  "search for tickets",
  "resale tickets will appear below when they are available",
  "tickets will appear below when they are available",
  "no tickets available",
  "no results available"
];

const PURCHASE_CTA_PHRASES = [
  "buy now",
  "checkout",
  "go to checkout",
  "continue",
  "next",
  "place order",
  "add to basket",
  "add to cart"
];

// 🔊 Sound
function playSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();

  setTimeout(() => {
    oscillator.stop();
    audioCtx.close();
  }, 400);
}

// 📲 Telegram
function sendTelegram() {
  chrome.runtime.sendMessage({
    type: "SEND_TELEGRAM",
    message: `🎟️ Tickets found!\n${window.location.href}`
  });
}

// 🚨 Notify
function notify() {
  const now = Date.now();

  if (now - lastNotification < 60000) return;

  lastNotification = now;

  console.log("🎟️ Tickets found!");

  playSound();
  sendTelegram();

  document.title = "🎟️ TICKETS FOUND";
}

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPageText() {
  return document.body.innerText.toLowerCase();
}

function hasPurchaseCTA() {
  return [...document.querySelectorAll("button, a")]
    .some((el) => {
      const label = (el.innerText || "").trim().toLowerCase();
      return PURCHASE_CTA_PHRASES.some((phrase) => label.includes(phrase));
    });
}

// 🎯 Detect tickets
function detectTickets() {
  const text = getPageText();

  if (NEGATIVE_AVAILABILITY_PHRASES.some((phrase) => text.includes(phrase))) {
    return false;
  }

  const hasPrice = /[£$]\s?\d/.test(text);

  return hasPrice && hasPurchaseCTA();
}

// 🎟️ Reserved
function hasReserved() {
  const text = getPageText();
  return text.includes("tickets reserved for");
}

// ⏳ Loading
function isLoading() {
  const text = getPageText();
  return text.includes("loading") || text.includes("searching");
}

// ⚠️ Error
function hasError() {
  const text = getPageText();
  return text.includes("something went wrong");
}

// 🔁 Click Find
function clickFind() {
  const btn = [...document.querySelectorAll("button")]
    .find(b => b.innerText.toLowerCase().includes("find tickets"));

  if (btn && !btn.disabled) {
    btn.click();
    return true;
  }
  return false;
}

// 🔁 Click Search Again
function clickSearchAgain() {
  const btn = [...document.querySelectorAll("button")]
    .find(b => b.innerText.toLowerCase().includes("search again"));

  if (btn && !btn.disabled) {
    btn.click();
    return true;
  }
  return false;
}

// 🔁 Main loop
function runTracker() {

  chrome.storage.local.get(["enabled"], (data) => {

    if (!data.enabled) {
      isRunning = false;
      return;
    }

    if (isRunning) return;
    isRunning = true;

    try {

      if (hasReserved()) {
        notify();
        scheduleNext(12000);
        return;
      }

      if (detectTickets()) {
        notify();
        scheduleNext(10000);
        return