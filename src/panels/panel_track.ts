import { ActionType } from '../types';
import { _getURL, getComponent } from '../utils';
import _ from '../variables';

export function setSegmentScore() {
  const total = Object.keys(_.TEMP_SCORE_DATA.timeline).length;
  _.SEGMENT_CORRECT_PANEL!.style.width = (_.TEMP_SCORE_DATA.current_correct / total) * 100 + '%';
  _.SEGMENT_INCORRECT_PANEL!.style.width = (_.TEMP_SCORE_DATA.current_incorrect / total) * 100 + '%';
  _.TRACK_SCORE!.innerText = `${_.TEMP_SCORE_DATA.current_correct + _.TEMP_SCORE_DATA.current_incorrect}/${total}`;
}

export function resetPanelScore() {
  resetScoreData();
  _.SEGMENT_CORRECT_PANEL!.style.width = '0%';
  _.SEGMENT_INCORRECT_PANEL!.style.width = '0%';
  _.TRACK_SCORE!.innerText = `0/${Object.keys(_.TEMP_SCORE_DATA.timeline).length}`;
  _.TRACK_PANEL_ITEM_WRAPPER!.innerHTML = '';
}
export function resetScoreData() {
  _.TEMP_SCORE_DATA = { current_correct: 0, current_incorrect: 0, timeline: {} };
  if (typeof _.CURRENT_TEMPLATE_ID != 'string') return;
  Object.entries(_.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes).forEach(
    ([timeline_id, timeline_value]) => {
      let is_satisfied = false;
      Object.entries(timeline_value.action).forEach(([action_id, action_value]) => {
        if (action_value.type != 'mark_correct' && action_value.type != 'mark_incorrect') return;
        is_satisfied = true;
        if (!_.TEMP_SCORE_DATA.timeline[timeline_id])
          _.TEMP_SCORE_DATA.timeline[timeline_id] = { data: [], is_executed: false };
        _.TEMP_SCORE_DATA.timeline[timeline_id].data.push({
          action_id: action_id,
          type: action_value.type,
          action_name: action_value.name,
        });
      });
    }
  );
}
export function getTrackScoreItemComponent(type: 'mark_correct' | 'mark_incorrect') {
  const item = getComponent('.tunkit_panel_track_item', false);
  item.style.background = type == 'mark_correct' ? '#16c47fb0' : '#d84040';

  return {
    getElement: () => item,
    setImgType: (type: ActionType) =>
      item
        .querySelector('.tunkit_parent_note_track_item_image')!
        .setAttribute('src', _getURL(`icons/${type}_white.svg`)),
    //@ts-ignore
    setTitle: (title: string) => (item.querySelector('.ytp-menuitem-label')!.innerText = title),
    //@ts-ignore
    setSecondaryTitle: (title: string) => (item.querySelector('.ytp-menu-label-secondary')!.innerText = title),
  };
}
