chrome.runtime.onMessage.addListener((message, sender, response) => {
  (async () => {
    const youtubeIDKey = `yi_${message.youtubeID}`;
    switch (message.type) {
      case 'GET_ALL_TEMPLATE': {
        const data = await chrome.storage.local.get({ [youtubeIDKey]: false });
        if (data[youtubeIDKey] == false) response({});
        else if (data?.[youtubeIDKey]?.template == undefined) throw new Error('Not found the template');
        else response(data[youtubeIDKey].template);
        break;
      }
      case 'GET_TEMPLATE': {
        const data = await chrome.storage.local.get({ [youtubeIDKey]: false });
        if (data[youtubeIDKey] == false || data[youtubeIDKey]?.template?.[message.id] == undefined)
          throw new Error('Not found the template');
        response(data[youtubeIDKey].template[message.id]);
        break;
      }
      case 'INSERT_TEMPLATE': {
        const templates = await chrome.storage.local.get({ [youtubeIDKey]: { template: {}, title: '' } });
        templates[youtubeIDKey].template[message.id] = message.data;
        const result = await chrome.storage.local.set({ [youtubeIDKey]: templates[youtubeIDKey] });
        response({ status: result == undefined ? 'success' : 'failed' });
        break;
      }
      case 'UPDATE_TEMPLATE': {
        const templates = await chrome.storage.local.get({ [youtubeIDKey]: { template: {}, title: '' } });
        if (templates[youtubeIDKey]?.template?.[message.id] == undefined)
          throw new Error("Can't update the template. It not found");
        Object.keys(message.data).forEach(e => {
          templates[youtubeIDKey].template[message.id][e] = message.data[e];
        });
        const result = await chrome.storage.local.set({ [youtubeIDKey]: templates[youtubeIDKey] });
        response({ status: result == undefined ? 'success' : 'failed' });
        break;
      }
      case 'REMOVE_TEMPLATE': {
        const data = await chrome.storage.local.get({ [youtubeIDKey]: false });
        if (data[youtubeIDKey] == false) throw new Error("Can't remove the template. It not found");
        delete data[youtubeIDKey].template[message.id];
        const result = await chrome.storage.local.set({ [youtubeIDKey]: data[youtubeIDKey] });
        response({ status: result == undefined ? 'success' : 'failed' });
        break;
      }
    }
  })();
  return true;
});
