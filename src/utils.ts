import { component_wrapper } from './init';

export function _getURL(url: string): string {
  return chrome.runtime.getURL(`assets/${url}`);
}
export function getComponent(query: string, is_remove: boolean = true): HTMLElement {
  const element = component_wrapper.querySelector(`${query}`);
  if (element == null) throw new Error("Can't find component");
  const copy = element.cloneNode(true) as HTMLElement;
  if (is_remove == true) element.remove();
  return copy;
}
export function randomString() {
  //@ts-ignore
  return '_' + (Date.now() + Math.random() + 1).toString(36).replaceAll('.', '');
}
export function getCurrentYoutubeId(): string {
  const youtubeID = new URLSearchParams(window.location.search).get('v');
  if (youtubeID == null) throw new Error("Can't get youtubeID");
  return youtubeID;
}
