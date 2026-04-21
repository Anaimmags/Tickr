// ======================
// Tickr Tracker
// ======================

let isRunning = false;
let lastNotification = 0;

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

// 🎯 Detect tickets
function detectTickets() {
  const text = document.body.innerText.toLowerCase();

  if (text.includes("there aren’t enough tickets")) return false;
  if (text.includes("search for tickets")) return false;

  return text.includes("£");
}

// 🎟️ Reserved
function hasReserved() {
  return document.body.innerText
    .toLowerCase()
    .includes("tickets reserved for");
}

// ⏳ Loading
function isLoading() {
  const text = document.body.innerText.toLowerCase();
  return text.includes("loading") || text.includes("searching");
}

// ⚠️ Error
function hasError() {
  return document.body.innerText
    .toLowerCase()
    .includes("something went wrong");
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

    if (!data.enabled) return;

    if (isRunning) return;
    isRunning = true;

    try {

      if (hasReserved()) {
        notify();
        scheduleNext(8000);
        return;
      }

      if (detectTickets()) {
        notify();
        scheduleNext(6000);
        return;
      }

      if (isLoading()) {
        scheduleNext(3000);
        return;
      }

      if (hasError()) {
        clickFind() || clickSearchAgain();
        scheduleNext(4000);
        return;
      }

      clickFind() || clickSearchAgain();
      scheduleNext();

    } catch (err) {
      console.log("Loop error:", err);
      scheduleNext(5000);
    }

  });
}

// ⏱️ Next loop
function scheduleNext(delay = Math.random() * 2000 + 3000) {
  setTimeout(() => {
    isRunning = false;
  }, delay);
}

// 🚀 Start loop
setInterval(runTracker, 1000);