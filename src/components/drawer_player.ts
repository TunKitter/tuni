import { getPlayerOverlay } from '../overlay';
import { _getURL } from '../utils';
import _ from '../variables';

export function getDrawerPlayerComponent() {
  const element = document.createElement('div');
  element.className = 'tunkit_timeline_interface tunkit_action_handler';
  const overlay = getPlayerOverlay();
  overlay.render();
  const toggle_button = document.createElement('div');
  toggle_button.className = 'tunkit_toggle_action_interface';
  toggle_button.innerHTML = `<img src="${_getURL('icons/close_notification.svg')}">`;
  element.appendChild(toggle_button);
  toggle_button.addEventListener('click', function () {
    _.VIDEO!.play();
    overlay.remove();
    element.style.right = '-100%';
    setTimeout(() => {
      element.remove();
    }, 500);
  });
  return {
    getElement: () => element,
    getToggleButton: () => toggle_button,
    getOverlay: () => overlay,
    handle() {
      _.VIDEO!.pause();
      overlay.show();
      _.VIDEO_PLAYER!.appendChild(element);
      setTimeout(() => {
        element.style.right = '0';
      }, 0);
    },
    setMessage(message: string) {
      element.innerText = message;
      element.appendChild(toggle_button);
    },
  };
}
