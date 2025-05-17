# Bot Reply Generator Chrome Extension

This Chrome Extension helps users generate personalized replies using different conversational tones—Funny, Angry, Professional, and Supportive—powered by the Shapes API. Simply paste a received message and add optional context/instructions, then select the bot tone you'd like the reply in.

---

## Features

* 🧠 Uses Shapes AI to generate high-quality responses
* 🤖 4 selectable bots with unique conversational styles:

  * Funny
  * Angry
  * Professional
  * Supportive
* 📝 Allows adding context/instructions to shape the reply
* 📋 Easy copy-to-clipboard functionality for generated replies
* 🧼 Clean and aesthetic user interface

---

## Installation

1. Clone or download the repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer Mode**
4. Click **Load unpacked** and select the folder containing this extension

---

## Configuration

Update the following in `config.js`:

```js
export const SHAPES_API_KEY = "<your-API-key>";
```

Replace `<your-API-key>` with your actual Shapes API key.

---

## Folder Structure

```
- manifest.json
- popup.html
- popup.js
- icon.png (your extension icon)
```

---

## Future Scope

1. **Custom Shape Bots**

   * Let users plug in their own Shape models via configuration or UI.

2. **Browser Chat Integration**

   * Auto-detect messages and generate replies directly in chat apps like Gmail, Slack, LinkedIn, etc.
   * Automatically respond to messages using background scripts and DOM event listeners.

3. **History and Favorites**

   * Save past generated replies and mark favorites for future use.

4. **Voice Input and Output**

   * Enable speaking a message and having the reply read back using Web Speech API.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork this repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request and describe your changes

Please make sure your code follows the style and naming conventions used in the project.

---

