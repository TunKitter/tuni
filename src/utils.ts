import { component_wrapper } from './init';
import _ from './variables';

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
export function getTitleYoutube() {
  const title = document.querySelector('#title > h1 > yt-formatted-string')?.textContent;
  if (title == undefined) throw new Error("Can't get youtube title");
  return title;
}
export function HmsToSeconds(text: string) {
  let p = text.split(':');
  if (p.length != 3) return parseInt(p[0]) * 60 + parseInt(p[1]);
  return parseInt(p[0]) * 3600 + parseInt(p[1]) * 60 + parseInt(p[2]);
}
export function secondsToHms(d: string) {
  let sec_num = parseInt(d, 10);
  let hours: number | string = Math.floor(sec_num / 3600);
  let minutes: number | string = Math.floor((sec_num - hours * 3600) / 60);
  let seconds: number | string = sec_num - hours * 3600 - minutes * 60;
  if (hours < 10) hours = '0' + hours + ':';
  else hours = hours + ':';
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return hours + minutes + ':' + seconds;
}
export function insertAdjacentElement(wrapper: HTMLElement, element: HTMLElement, query: string) {
  const adjElement = wrapper.querySelector(query);
  if (adjElement == null) throw new Error('The element does not exists');
  adjElement.insertAdjacentElement('afterend', element);
}
export function getTimelineTextFormat(start: number, end: number) {
  return `${secondsToHms(String(start))} — ${secondsToHms(String(end))}`;
}
export function isForcePauseVideo(state: boolean, remain_time?: number) {
  _.VIDEO![state ? 'addEventListener' : 'removeEventListener']('playing', pauseVideo);
  if (remain_time) _.VIDEO!.currentTime = remain_time;
}
function pauseVideo() {
  (_.VIDEO as HTMLVideoElement).pause();
}
