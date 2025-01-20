export function _getURL(url: string) {
  return chrome.runtime.getURL(`assets/${url}`);
}
