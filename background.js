let autoReplyActive = false;
let selectedBot = "professional"; // default fallback

// Listen to messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "START_AUTO_REPLY") {
    autoReplyActive = true;
    selectedBot = message.bot;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "ENABLE_AUTO_REPLY",
        bot: selectedBot
      });
    });

    sendResponse({ status: "Auto-reply enabled" });

  } else if (message.type === "STOP_AUTO_REPLY") {
    autoReplyActive = false;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "DISABLE_AUTO_REPLY"
      });
    });

    sendResponse({ status: "Auto-reply disabled" });
  }
});
