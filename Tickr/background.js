// ======================
// Tickr Background
// ======================

const TOKEN = "8222436053:AAETFvi9s_gWn1JsvFfuIEAWSKIbAezkPGg";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.type === "SEND_TELEGRAM") {

    chrome.storage.local.get(["chatId"], async (data) => {
      const chatId = data.chatId;

      if (!chatId) {
        sendResponse({ success: false, error: "No chatId set" });
        return;
      }

      try {
        const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
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
        console.log("📲 Telegram:", result);

        sendResponse({ success: true });

      } catch (err) {
        console.error("❌ Telegram error:", err);
        sendResponse({ success: false });
      }
    });

    return true;
  }

});