import TimelineInterfaceElementNavigator from './navigator/timeline_interface_element_navigator';
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
export function activeTimelineInVideo(state: {
  timeout?: 'clear';
  video?: 'add' | 'remove';
  playing?: 'add' | 'remove';
  data_timeline?: 'set';
}) {
  if (state?.data_timeline == 'set') setDataInterface();
  if (state?.timeout == 'clear') clearAllTimeout();
  if (state?.video)
    _.VIDEO![state.video == 'add' ? 'addEventListener' : 'removeEventListener'](
      'timeupdate',
      activeTimelineVideoHandler
    );
  if (state?.playing)
    _.VIDEO![state.playing == 'add' ? 'addEventListener' : 'removeEventListener'](
      'playing',
      activeTimelineVideoHandler
    );
}
function activeTimelineVideoHandler() {
  console.log('i check');
  if (!Array.isArray(_.DATA_TIMELINE_INTERFACE)) throw new Error('There is some problem with timeline interface');

  const currentTime = _.VIDEO!.currentTime;
  const next_interface = _.DATA_TIMELINE_INTERFACE.find(cur => cur.start <= currentTime && currentTime <= cur.end);
  if (next_interface != undefined) {
    next_interface.element.show();
    activeTimelineInVideo({ video: 'add' });
  } else {
    _.DATA_TIMELINE_INTERFACE.map(e => void e.element.hide());
    const next_interface = _.DATA_TIMELINE_INTERFACE.reduce(
      (prev, cur) => {
        const currentTime = _.VIDEO!.currentTime;
        if (cur.start >= currentTime && currentTime <= cur.end && cur.start < prev.start) return cur;
        else return prev;
      },
      { start: _.VIDEO!.duration, end: -1 }
    ) as any;
    if (next_interface != undefined && next_interface.end >= 0) {
      const timeout = (next_interface.start - _.VIDEO!.currentTime - 1) * 1000;
      console.log('i will be active in ', timeout, ' millisecond');
      activeTimelineInVideo({ timeout: 'clear', video: 'remove' });
      _.SET_TIMEOUT_RECHECK_TIMELINE.push(
        setTimeout(
          () => {
            activeTimelineInVideo({ video: 'add' });
          },
          timeout > 0 ? timeout : 0
        )
      );
    } else {
      activeTimelineInVideo({ video: 'remove', timeout: 'clear' });
    }
  }
}
function clearAllTimeout() {
  //@ts-ignore
  _.SET_TIMEOUT_RECHECK_TIMELINE.forEach(timeout => void clearTimeout(timeout));
  _.SET_TIMEOUT_RECHECK_TIMELINE = [];
}
export function setDataInterface() {
  if (typeof _.CURRENT_TEMPLATE_ID != 'string') throw new Error('There is some problem when set timeline interface');
  // _.DATA_TIMELINE_INTERFACE?.map(e => e.element.removeElement());
  _.DATA_TIMELINE_INTERFACE = [];
  Object.entries(_.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes).forEach(([key, value]) => {
    const element = TimelineInterfaceElementNavigator(value.type, value);
    element.render();
    _.DATA_TIMELINE_INTERFACE!.push({
      start: value.startTime,
      end: value.endTime,
      element: element,
      timeline_id: key,
      timeline_data: value,
    });
  });
}
