var is_init = false;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type == 'INITIAL') {
    sendResponse({ is_init });
    is_init = true;
  }
});

navigation.addEventListener('navigate', () => {
  if (!is_init)
    chrome.runtime.sendMessage({ type: 'NAVIGATE' }, function (response) {
      if (response == 'ok') is_init = true;
    });
});
