import { SHAPES_API_KEY } from "./config.js"

const botModels = {
    funny: "shapesinc/tenshi",
    diplomatic: "shapesinc/deplo",
    professional: "shapesinc/jay-n655",
    supportive: "shapesinc/ktrcemotionalsupport"
  };
  
  document.getElementById('generateBtn').addEventListener('click', async () => {
    const bot = document.getElementById('botSelector').value;
    const model = botModels[bot];
    const message = document.getElementById('userMessage').value;
    const instructions = document.getElementById('instructions').value;
    const responseDiv = document.getElementById('replyText');
    const copyBtn = document.getElementById('copyBtn');
    responseDiv.textContent = 'Generating reply...';
    copyBtn.style.display = 'none';
  
    try {
      const response = await fetch("https://api.shapes.inc/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SHAPES_API_KEY}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: `Message: ${message}\nInstructions: ${instructions}`
            }
          ]
        })
      });
  
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'No reply generated.';
      responseDiv.textContent = reply;
      copyBtn.style.display = 'inline-block';
    } catch (err) {
      responseDiv.textContent = 'Error: ' + err.message;
      copyBtn.style.display = 'none';
    }
  });

document.getElementById('copyBtn').addEventListener('click', () => {
    const text = document.getElementById('replyText').textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copyBtn');
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 1500);
    });
  });

  document.getElementById('autoReplyToggle').addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    console.log(enabled);
  
    const selectedBot = document.getElementById('botSelector').value;
    chrome.storage.local.set({ selectedBot });
  
    // Disable or enable other inputs
    ['botSelector', 'userMessage', 'instructions', 'generateBtn'].forEach(id => {
      document.getElementById(id).disabled = enabled;
    });
  
    // Send message to content script in active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (enabled) {
      chrome.tabs.sendMessage(tab.id, {
        type: "ENABLE_AUTO_REPLY",
        bot: selectedBot
      });
    } else {
      chrome.tabs.sendMessage(tab.id, {
        type: "DISABLE_AUTO_REPLY"
      });
    }
  });
  
