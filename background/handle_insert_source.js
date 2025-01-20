import { insertSource } from './insert_source.js';

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url && tab.url.indexOf('https://www.youtube.com/watch?v=') == 0) {
    chrome.tabs.sendMessage(tabId, { type: 'INITIAL' }, function (response) {
      if (response?.is_init == false) {
        insertSource(tabId);
      }
      console.log(chrome.runtime.lastError);
    });
  }
});
