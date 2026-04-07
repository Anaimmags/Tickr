let isEnabled = false;
let isPremium = false;

// Load state
chrome.storage.local.get(["enabled", "premium"], (data) => {
  isEnabled = data.enabled || false;
  isPremium = data.premium || false;

  updateUI();
});

// ======================
// UI
// ======================

function updateUI() {
  const status = document.getElementById("status");
  const startBtn = document.getElementById("startBtn");
  const buyBtn = document.getElementById("buyBtn");
  const telegramSection = document.getElementById("telegramSection");

  // Start / Pause
  if (isEnabled) {
    status.innerText = "🟢 Running";
    startBtn.innerText = "⏸ Pause bot";
  } else {
    status.innerText = "🔴 Paused";
    startBtn.innerText = "▶️ Start bot";
  }

  // Premium
  if (isPremium) {
    buyBtn.innerText = "💎 Premium Active";
    buyBtn.disabled = true;
    buyBtn.style.background = "linear-gradient(90deg, #7b5cff, #6dd5fa)";

    telegramSection.style.display = "block";
  } else {
    telegramSection.style.display = "none";
  }
}

// ======================
// Start / Pause
// ======================

document.getElementById("startBtn").addEventListener("click", () => {
  isEnabled = !isEnabled;

  chrome.storage.local.set({ enabled: isEnabled }, updateUI);
});

// ======================
// Buy Premium
// ======================

document.getElementById("buyBtn").addEventListener("click", () => {
  if (!isPremium) {
    window.open("https://anaimma.gumroad.com/l/Tickr");
  }
});

// ======================
// Activate Code
// ======================

document.getElementById("activateBtn").addEventListener("click", () => {
  const code = document.getElementById("codeInput").value.trim();

  if (code === "TICKR-2026") {
    isPremium = true;

    chrome.storage.local.set({ premium: true }, () => {
      updateUI();
      alert("Premium unlocked 🚀");
    });

  } else {
    alert("Invalid code ❌");
  }
});

// ======================
// Save Telegram
// ======================

document.getElementById("saveTelegram").addEventListener("click", () => {
  const chatId = document.getElementById("chatId").value.trim();

  if (!chatId) {
    alert("Enter Chat ID first");
    return;
  }

  chrome.storage.local.set({ chatId }, () => {
    alert("Telegram saved 📲");
  });
});