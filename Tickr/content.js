// ======================
// TickrNotBot FINAL
// ======================

let isRunning = false;
let lastNotification = 0;
let isEnabled = true;
let isPremium = false;

// 🔄 Load settings
chrome.storage.local.get(["enabled", "premium"], (data) => {
  isEnabled = data.enabled ?? true;
  isPremium = data.premium ?? false;
});

// 🔄 Listen for changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) isEnabled = changes.enabled.newValue;
  if (changes.premium) isPremium = changes.premium.newValue;
});

// 🔊 Sound (premium)
function playSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();

  setTimeout(() => {
    oscillator.stop();
    audioCtx.close();
  }, 500);
}

// 📲 Telegram (premium)
function sendTelegramAlert() {
  chrome.runtime.sendMessage({
    type: "SEND_TELEGRAM",
    message: `🎟️ Tickets found!\n${window.location.href}`
  });
}

// 🚨 Notify (premium only)
function notify() {
  if (!isPremium) return;

  const now = Date.now();

  if (now - lastNotification < 60000) {
    console.log("⏳ Skipping duplicate notification");
    return;
  }

  lastNotification = now;

  console.log("🚨 TICKETS FOUND!");

  playSound();
  sendTelegramAlert();

  document.title = "🎟️ TICKETS FOUND!!!";
}

// ❌ Only run on event page
function isEventPage() {
  return window.location.href.includes("/event/");
}

// 🎯 Detect tickets
function detectTickets() {
  const text = document.body.innerText.toLowerCase();

  if (text.includes("there aren’t enough tickets")) return false;
  if (text.includes("search for tickets")) return false;

  const results = document.querySelector('[class*="result"], [class*="offer"], [class*="list"]');

  return results && results.innerText.includes("£");
}

// 🎟️ Reserved tickets
function hasReservedTickets() {
  return document.body.innerText
    .toLowerCase()
    .includes("tickets reserved for");
}

// ⏳ Loading state
function isLoading() {
  const text = document.body.innerText.toLowerCase();

  return (
    text.includes("loading") ||
    text.includes("searching") ||
    text.includes("please wait")
  );
}

// ⚠️ Error detection (important fix)
function hasError() {
  const text = document.body.innerText.toLowerCase();

  return (
    text.includes("something went wrong") ||
    text.includes("failed to fetch")
  );
}

// 🔁 Click Find Tickets
function clickFindTickets() {
  const btn = [...document.querySelectorAll("button")]
    .find(b => b.innerText.toLowerCase().includes("find tickets"));

  if (btn && !btn.disabled) {
    console.log("🔁 Clicking Find Tickets");
    setTimeout(() => btn.click(), Math.random() * 800);
    return true;
  }
  return false;
}

// 🔁 Click Search Again
function clickSearchAgain() {
  const btn = [...document.querySelectorAll("button")]
    .find(b => b.innerText.toLowerCase().includes("search again"));

  if (btn && !btn.disabled) {
    console.log("🔁 Clicking Search Again");
    setTimeout(() => btn.click(), Math.random() * 800);
    return true;
  }
  return false;
}

// ⏱️ Smart delay (premium faster)
function scheduleNext(customDelay) {
  let delay;

  if (customDelay) {
    delay = customDelay;
  } else {
    delay = isPremium
      ? Math.floor(Math.random() * 1500) + 2000   // ⚡ faster
      : Math.floor(Math.random() * 2000) + 4000;  // 🐢 slower
  }

  console.log(`⏱ Next in ${delay}ms`);

  setTimeout(() => {
    isRunning = false;
  }, delay);
}

// 🧠 Main loop
function runBot() {
  if (!isEnabled) {
    console.log("⏸ Bot paused");
    return;
  }

  if (!isEventPage()) return;
  if (isRunning) return;

  isRunning = true;

  try {

    // 🎟️ Tickets reserved (MAIN WIN CONDITION)
    if (hasReservedTickets()) {
      console.log("🎟️ Tickets reserved!");
      notify();

      scheduleNext(10000); // give user time
      return;
    }

    // 🎯 Tickets detected
    if (detectTickets()) {
      console.log("🎟️ Tickets detected!");
      notify();

      scheduleNext(8000);
      return;
    }

    // ⏳ Loading
    if (isLoading()) {
      console.log("⏳ Loading...");
      scheduleNext(3000);
      return;
    }

    // ⚠️ ERROR → FORCE RETRY (CRITICAL FIX)
    if (hasError()) {
      console.log("⚠️ Error detected — forcing retry");

      if (clickFindTickets()) {
        scheduleNext(3500);
        return;
      }

      if (clickSearchAgain()) {
        scheduleNext(3500);
        return;
      }

      scheduleNext(4000);
      return;
    }

    // 🔁 Normal flow
    if (clickSearchAgain()) {
      scheduleNext();
      return;
    }

    if (clickFindTickets()) {
      scheduleNext();
      return;
    }

    // fallback
    scheduleNext();

  } catch (err) {
    console.error("Bot error:", err);
    scheduleNext(5000);
  }
}

// 🔁 Start loop
setInterval(runBot, 1000);