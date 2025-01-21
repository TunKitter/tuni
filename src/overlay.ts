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
