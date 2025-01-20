import { _getURL } from './utils';

export function insertToggleIconMenu() {
  const wrapper = document.querySelector('.ytp-subtitles-button.ytp-button');
  if (wrapper == null) throw new Error("Can't insert trigger button");
  const button = document.createElement('button');
  button.classList.add('ytp-button');
  button.id = 'tunkit_interactive_button';
  button.innerHTML = `<img id="tunkit_svg" aria-pressed="false" class="ytp-svg-shadow" src="${_getURL(
    'icons/panel_icon.svg'
  )}"/>`;
  wrapper.insertAdjacentElement('afterend', button);
}
