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
