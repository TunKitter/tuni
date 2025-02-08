chrome.runtime.onMessage.addListener((message, sender, response) => {
  (async () => {
    switch (message.type) {
      case 'GET_TAGS_DATA': {
        const data = await chrome.storage.local.get({ FOLDER_DATA: false });
        if (data.FOLDER_DATA == false) response([]);
        else if (message.option?.include_key) response(data.FOLDER_DATA);
        else response(Object.values(data.FOLDER_DATA));
        break;
      }
      case 'SET_TAGS_DATA': {
        let result = await chrome.storage.local.get({ FOLDER_DATA: false });
        if (result.FOLDER_DATA == false) result = {};
        else result = result.FOLDER_DATA;
        message.data.map(e => {
          result[e.key] = e.data;
        });
        await chrome.storage.local.set({ FOLDER_DATA: result });
        response({
          status: 'success',
        });
        break;
      }
    }
  })();
  return true;
});
