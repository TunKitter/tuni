var is_init = false;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type == 'INITIAL') {
    sendResponse({ is_init });
    is_init = true;
  }
});
