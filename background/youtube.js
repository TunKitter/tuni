chrome.runtime.onMessage.addListener((message, sender, response) => {
  (async () => {
    const youtubeIDKey = `yi_${message.youtubeID}`;
    switch (message.type) {
      case 'GET_TITLE_YOUTUBE': {
        const data = await chrome.storage.local.get({ [youtubeIDKey]: false });
        if (data[youtubeIDKey] == false) response(undefined);
        else if (data?.[youtubeIDKey]?.title == undefined) throw new Error('Not found the title');
        else response(data[youtubeIDKey].title);
        break;
      }
      case 'SET_TITLE_YOUTUBE': {
        const data = await chrome.storage.local.get({ [youtubeIDKey]: false });
        if (data?.[youtubeIDKey]?.title == undefined) throw new Error('Not found the title');
        data[youtubeIDKey].title = message.title;
        await chrome.storage.local.set({ [youtubeIDKey]: data[youtubeIDKey] });
        response({ status: 'success' });
        break;
      }
    }
  })();
  return true;
});
