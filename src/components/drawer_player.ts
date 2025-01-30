import { getPlayerOverlay } from '../overlay';
import { _getURL } from '../utils';
import _ from '../variables';

export function getDrawerPlayerComponent() {
  const element = document.createElement('div');
  element.className = 'tunkit_timeline_interface tunkit_action_handler';
  const overlay = getPlayerOverlay(1000);
  overlay.render();
  const toggle_button = document.createElement('div');
  toggle_button.className = 'tunkit_toggle_action_interface';
  toggle_button.innerHTML = `<img src="${_getURL('icons/close_notification.svg')}">`;
  element.appendChild(toggle_button);
  handleMoveableElementInPlayer(element, overlay.getElement(), toggle_button);
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
    setContent(message: string, is_html = false) {
      const hint = document.createElement('span');
      hint.className = 'tunkit_hint_player_drawer';
      hint.innerText = '*Holding outside to change the size';
      element[is_html ? 'innerHTML' : 'innerText'] = message;
      Object.assign(element.style, {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      });
      element.appendChild(hint);
      element.appendChild(toggle_button);
    },
  };
}
function handleMoveableElementInPlayer(element: HTMLElement, overlay: HTMLElement, toggle_button: HTMLElement) {
  let is_move = false;
  const rootRect = overlay.getBoundingClientRect();
  function mouseUp() {
    is_move = false;
    // @ts-ignore
    this.style.cursor = 'default';
    element.style.zIndex = '1000';
  }
  function mouseDown() {
    is_move = true;
    // @ts-ignore
    this.style.cursor = 'col-resize';
    element.style.zIndex = '998';
  }
  function mouseMove(e: any) {
    if (!is_move) return;
    element.style.width = `${100 - (e.offsetX / rootRect.width) * 100}%`;
  }
  overlay.addEventListener('mouseup', mouseUp);
  overlay.addEventListener('mousedown', mouseDown);
  overlay.addEventListener('mousemove', mouseMove);
  toggle_button.addEventListener('click', function () {
    overlay?.removeEventListener('mouseup', mouseUp);
    overlay?.removeEventListener('mousedown', mouseDown);
    overlay?.removeEventListener('mousemove', mouseMove);
    element.style.transitionDuration = '0.4s';
  });
  setTimeout(() => {
    element.style.transitionDuration = 'initial';
  }, 400);
}
