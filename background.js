// ======================
// Tickr Background (Telegram)
// ======================

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.type === "SEND_TELEGRAM") {

    // Get saved token + chat ID
    chrome.storage.local.get(["chatId", "token"], async (data) => {
      const chatId = data.chatId;
      const token = data.token;

      // Validate
      if (!chatId || !token) {
        console.log("❌ Missing Telegram config");
        sendResponse({ success: false });
        return;
      }

      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: msg.message
          })
        });

        const result = await res.json();
        console.log("📲 Telegram sent:", result);

        sendResponse({ success: true });

      } catch (err) {
        console.error("❌ Telegram error:", err);
        sendResponse({ success: false });
      }
    });

    return true; // required for async response
  }

});