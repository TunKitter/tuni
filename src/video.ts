import { ActionPointerDataType } from './types';
import { _getURL } from './utils';
import _ from './variables';

export function initPointerVideo(temp_action: { [key: string]: ActionPointerDataType }, action_id: string) {
  const axis = temp_action[action_id].axis;
  const wrapper_player = document.createElement('div');
  wrapper_player.className = 'tunkit_pointer_wrapper';
  const pointer = document.createElement('div');
  pointer.className = 'tunkit_pointer_child';
  pointer.style.left = axis.x + '%';
  pointer.style.top = axis.y + '%';
  pointer.innerHTML = `<img src="${_getURL('icons/pointer.svg')}" /> <span>Pointer</span>`;
  _.VIDEO_PLAYER?.appendChild(pointer);
  let half_child_width = 36;
  let half_child_height = 12;
  let is_move = false;
  (document.querySelector('#below > ytd-watch-metadata') as HTMLElement).style.opacity = '0.4';
  wrapper_player.onmouseup = () => (is_move = false);
  wrapper_player.onmousedown = () => (is_move = true);
  wrapper_player.onmouseout = () => (is_move = false);
  let old_x = axis.x;
  let old_y = axis.y;
  wrapper_player.addEventListener('mousemove', e => {
    if (!is_move) return;
    const rootRect = wrapper_player.getBoundingClientRect();
    let newLeft = e.offsetX - half_child_width;
    let newTop = e.offsetY - half_child_height;
    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    if (newLeft + half_child_width * 2 > rootRect.width) newLeft = rootRect.width - half_child_width * 2;
    if (newTop + half_child_height * 2 > rootRect.height) newTop = rootRect.height - half_child_height * 2;
    // console.log(`% of left is ${(newLeft / rootRect.width) * 100} % of top is ${(newTop / rootRect.height) * 100}%`);
    old_x = (newLeft / rootRect.width) * 100;
    old_y = (newTop / rootRect.height) * 100;
    pointer.style.left = old_x + '%';
    pointer.style.top = old_y + '%';
  });
  const div = document.createElement('div');
  div.className = 'tunkit_pointer_overlay';
  const buttons = document.createElement('div');
  buttons.className = 'tunkit_pointer_buttons tunkit_flex_center';
  buttons.style.gap = '1em';
  buttons.style.alignItems = 'baseline';
  buttons.innerHTML = `
    <button class="save_pointer_btn yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m" style="margin: 0 auto; margin-bottom: 1em">Save</button>
    <button style="background: #333;color: white;" class="cancel_pointer_btn yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m" style="margin: 0 auto; margin-bottom: 1em">Cancel</button>
    `;
  buttons.querySelector('.cancel_pointer_btn')?.addEventListener('click', () => {
    clearElementsAndRestoreDialog();
  });
  buttons.querySelector('.save_pointer_btn')?.addEventListener('click', () => {
    // const rootRect = wrapper_player.getBoundingClientRect();
    const x = pointer.style.left.replace('%', '').replace('px', '');
    const y = pointer.style.top.replace('%', '').replace('px', '');
    //@ts-ignore
    temp_action[action_id].axis = { x, y };
    clearElementsAndRestoreDialog();
  });
  _.VIDEO_PLAYER?.appendChild(wrapper_player);
  _.VIDEO_PLAYER?.appendChild(div);
  document.querySelector('#clarify-box')?.appendChild(buttons);
  // _.VIDEO_PLAYER?.appendChild(buttons);
  function clearElementsAndRestoreDialog() {
    wrapper_player.remove();
    pointer.remove();
    div.remove();
    buttons.remove();
    (_.DIALOG_WRAPPER as HTMLElement).style.display = 'initial';
    (_.FULL_OVERLAY_WRAPPER as HTMLElement).style.display = 'block';
    _.PANEL_WRAPPER?.classList.add('tunkit_menu_active');
    (document.querySelector('#below > ytd-watch-metadata') as HTMLElement).style.opacity = '1';
    window.removeEventListener('resize', initialPositionPointer);
    window.removeEventListener('fullscreenchange', initialPositionPointer);
  }
  window.addEventListener('resize', initialPositionPointer);
  window.addEventListener('fullscreenchange', initialPositionPointer);
  function initialPositionPointer() {
    // console.log('okkk');
    // const rootRect = wrapper_player.getBoundingClientRect();
    pointer.style.left = old_x + '%';
    pointer.style.top = old_y + '%';
    // pointer.style.left = (parseInt(pointer.style.left) / rootRect.width) * 100 + '%';
    // pointer.style.top = (parseInt(pointer.style.top) / rootRect.height) * 100 + '%';
  }
}
