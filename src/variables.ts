import { getComponent } from './utils';

const _ = {
  PANEL_WRAPPER: null as HTMLElement | null,
  IS_GET_TEMPLATE: false,
  TEMPLATE_PANEL_WRAPPER: null as HTMLElement | null,
  FULL_OVERLAY_WRAPPER: document.createElement('div'),
  FULL_OVERLAY: document.createElement('tp-yt-iron-overlay-backdrop'),
  DIALOG_WRAPPER: document.createElement('div'),
};

export function initAfterInsertComponent() {
  _.PANEL_WRAPPER = getComponent('.tunkit_panel_wrapper') as HTMLElement;
  _.TEMPLATE_PANEL_WRAPPER = _.PANEL_WRAPPER?.querySelector('.tunkit_template_wrapper') as HTMLElement;
  _.FULL_OVERLAY_WRAPPER.className = 'tunkit_overlay_wrapper';
  document.body.insertAdjacentElement('afterend', _.FULL_OVERLAY_WRAPPER);
  _.FULL_OVERLAY.className = 'tunkit_overlay opened';
  _.FULL_OVERLAY.style.zIndex = '2201';
  _.DIALOG_WRAPPER.className = 'tunkit_dialog_wrapper';
  document.body.insertAdjacentElement('afterend', _.DIALOG_WRAPPER);
}
export default _;
