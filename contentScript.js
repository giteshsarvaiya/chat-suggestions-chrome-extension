let SHAPES_API_KEY = "M3PDVIGP30BZJYRHCG8MCLHQGESLJTZQABPMAAXIOHO";

let observer;
let autoReplyActive = false;

const botModels = {
  funny: "shapesinc/tenshi",
  diplomatic: "shapesinc/deplo",
  professional: "shapesinc/jay-n655",
  supportive: "shapesinc/ktrcemotionalsupport"
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ENABLE_AUTO_REPLY") {
    autoReplyActive = true;
    observeChat();
  } else if (request.type === "DISABLE_AUTO_REPLY") {
    autoReplyActive = false;
    if (observer) observer.disconnect();
  }
});

function observeChat() {
  // Try different selectors to find the chat container
  const chatContainer = document.querySelector('[contenteditable="true"]') || 
                       document.querySelector('.chat-input') ||
                       document.querySelector('[role="textbox"]');

  if (!chatContainer) {
    console.error('Chat container not found');
    return;
  }

  observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (!autoReplyActive) return;
      
      // Look for new messages in the chat
      const messages = document.querySelectorAll('.message, .chat-message, [data-message]');
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage && !lastMessage.dataset.processed) {
        const messageText = lastMessage.textContent.trim();
        if (messageText) {
          lastMessage.dataset.processed = 'true';
          fetchReplyAndInsert(messageText);
        }
      }
    });
  });

  // Observe the entire chat area for new messages
  const chatArea = document.querySelector('.chat-container, .messages-container, .chat');
  if (chatArea) {
    observer.observe(chatArea, { childList: true, subtree: true });
  }
}

async function fetchReplyAndInsert(message) {
  try {
    // Get selected bot from chrome storage
    const { selectedBot } = await chrome.storage.local.get(['selectedBot']);
    const model = botModels[selectedBot] || botModels.professional;

    const response = await fetch("https://api.shapes.inc/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SHAPES_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: message }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const reply = await response.json();
    const responseText = reply.choices?.[0]?.message?.content || '';
    
    if (!responseText) {
      throw new Error('No response text received from API');
    }

    // Find the input box
    const inputBox = document.querySelector('[contenteditable="true"]') || 
                    document.querySelector('.chat-input') ||
                    document.querySelector('[role="textbox"]');

    if (!inputBox) {
      throw new Error('Chat input box not found');
    }

    // Insert the text
    inputBox.textContent = responseText;
    inputBox.dispatchEvent(new Event('input', { bubbles: true }));

    // Find and click the send button
    const sendButton = document.querySelector('button[type="submit"], .send-button, [aria-label="Send"]');
    if (sendButton) {
      sendButton.click();
    } else {
      // If no send button found, try to simulate Enter key
      inputBox.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true
      }));
    }
  } catch (error) {
    console.error('Error in fetchReplyAndInsert:', error);
  }
}
