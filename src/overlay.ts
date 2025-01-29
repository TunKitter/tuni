import _ from './variables.js';

export function getFullOverlay(zIndex?: number) {
  const overlay = _.FULL_OVERLAY.cloneNode(true) as HTMLElement;
  if (zIndex) overlay.style.zIndex = String(zIndex);
  return {
    render() {
      _.FULL_OVERLAY_WRAPPER.appendChild(overlay);
    },
    getElement: () => overlay,
  };
}
const PLAYER_OVERLAY = document.createElement('div');
PLAYER_OVERLAY.className = 'tunkit_player_overlay';
export function getPlayerOverlay(zIndex?: number) {
  const overlay = PLAYER_OVERLAY.cloneNode(true) as HTMLElement;
  if (zIndex) overlay.style.zIndex = String(zIndex);
  return {
    getElement: () => overlay,
    render() {
      overlay.style.height = '0';
      _.VIDEO_PLAYER!.appendChild(overlay);
    },
    show() {
      overlay.style.height = '100%';
    },
    hide() {
      overlay.style.height = '0';
    },

    remove: () => {
      overlay.style.height = '0';
      setTimeout(() => {
        overlay.remove();
      }, 1000);
    },
  };
}
