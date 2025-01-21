chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log(changes, namespace);
});

chrome.storage.local.get().then(data => console.log('log in background: ', data));
