export function insertSource(tabId) {
  chrome.scripting.insertCSS({
    target: { tabId },
    files: ['/assets/css/main.css'],
  });
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['/assets/js/bundle.js'],
  });
}
