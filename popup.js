let isEnabled = false;

// Load saved data
chrome.storage.local.get(["enabled", "chatId", "token"], (data) => {
  isEnabled = data.enabled || false;

  if (data.chatId) document.getElementById("chatId").value = data.chatId;
  if (data.token) document.getElementById("token").value = data.token;

  updateUI();
});

// UI
function updateUI() {
  const status = document.getElementById("status");
  const btn = document.getElementById("startBtn");

  if (isEnabled) {
    status.innerText = "🟢 Running";
    btn.innerText = "⏸ Pause tracking";
  } else {
    status.innerText = "🔴 Paused";
    btn.innerText = "▶️ Start tracking";
  }
}

// Toggle
document.getElementById("startBtn").addEventListener("click", () => {
  isEnabled = !isEnabled;

  chrome.storage.local.set({ enabled: isEnabled }, updateUI);
});

// Save Telegram
document.getElementById("saveTelegram").addEventListener("click", () => {
  const chatId = document.getElementById("chatId").value.trim();
  const token = document.getElementById("token").value.trim();

  if (!chatId || !token) {
    alert("Enter both Token and Chat ID");
    return;
  }

  chrome.storage.local.set({ chatId, token }, () => {
    alert("Telegram saved 📲");
  });
});

// Buy me a coffee
document.getElementById("coffeeBtn").addEventListener("click", () => {
  window.open("https://buymeacoffee.com/starcolision");
});

// 🧪 Test Telegram
document.getElementById("testTelegram").addEventListener("click", () => {

  chrome.runtime.sendMessage({
    type: "SEND_TELEGRAM",
    message: "🧪 Tickr test message — Telegram is working!"
  }, (response) => {

    if (response && response.success) {
      alert("✅ Telegram working!");
    } else {
      alert("❌ Failed — check token & chat ID");
    }

  });

});