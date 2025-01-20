import { _getURL } from './utils';
import _, { initAfterInsertComponent } from './variables';

export const component_wrapper = document.createElement('div');
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
export async function insertComponent() {
  await fetch(_getURL('static/bundle.html'))
    .then(html => html.text())
    .then(function (html) {
      const url = _getURL('icons/');
      // @ts-ignore
      html = html.replaceAll(/{{icon\./g, url).replaceAll('}}', '.svg');
      component_wrapper.innerHTML = html;
      initAfterInsertComponent();
    });
}
export function insertMenuPanel() {
  document
    .querySelector('.ytp-popup.ytp-settings-menu')
    ?.insertAdjacentElement('afterend', _.PANEL_WRAPPER as HTMLElement);
}
export function handelTogglePanel() {
  const button_toggle = document.querySelector('#tunkit_interactive_button');
  if (button_toggle == null) throw new Error("Can't find trigger button");
  button_toggle.addEventListener('click', () =>
    (_.PANEL_WRAPPER as HTMLElement).classList.toggle('tunkit_menu_active')
  );
}
