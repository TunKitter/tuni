import { getFullOverlay } from '../overlay';
type option_type = {
  close_selector?: string[];
  overlay_z_index?: number;
};
export function DialogWithOverlayFlow(dialog: HTMLElement, option: option_type) {
  let overlay = option?.overlay_z_index != undefined ? getFullOverlay(option.overlay_z_index) : null;
  overlay?.render();
  option.close_selector?.map(e => {
    //@ts-ignore
    dialog.querySelector(e).addEventListener('click', function () {
      dialog.remove();
      overlay?.getElement()?.remove();
    });
  });
  return {
    removeOverlay: () => overlay?.getElement()?.remove(),
    removeDialog: () => dialog.remove(),
  };
}
