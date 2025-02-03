import TimelineInterface from './interface/TimelineInterface';
import { TemplateType, TimelineDataType } from './types';
import { getComponent } from './utils';

const _ = {
  PANEL_WRAPPER: null as HTMLElement | null,
  IS_GET_TEMPLATE: false,
  IS_GET_TIMELINE: false,
  TEMPLATE_PANEL_WRAPPER: null as HTMLElement | null,
  TIMELINE_PANEL_WRAPPER: null as HTMLElement | null,
  FULL_OVERLAY_WRAPPER: document.createElement('div'),
  FULL_OVERLAY: document.createElement('tp-yt-iron-overlay-backdrop'),
  DIALOG_WRAPPER: document.createElement('div'),
  CURRENT_TEMPLATE_ID: null as string | null,
  TIMELINE_NOTE: {} as { [key: string]: TemplateType },
  VIDEO: null as HTMLVideoElement | null,
  TEMP_REFERENCE_ACTION_ELEMENT: null as DocumentFragment | null,
  VIDEO_PLAYER: null as HTMLElement | null,
  SET_TIMEOUT_RECHECK_TIMELINE: [] as any,
  DATA_TIMELINE_INTERFACE: null as
    | { start: number; end: number; element: TimelineInterface; timeline_id: string; timeline_data: TimelineDataType }[]
    | null,
  TRACK_PANEL_ITEM_WRAPPER: null as HTMLElement | null,
  PANEL_TRACK_ITEM: document.createElement('div'),
  SEGMENT_CORRECT_PANEL: null as HTMLElement | null,
  SEGMENT_INCORRECT_PANEL: null as HTMLElement | null,
  TRACK_SCORE: null as HTMLElement | null,
  TEMP_SCORE_DATA: {} as {
    current_correct: number;
    current_incorrect: number;
    timeline: {
      [key: string]: {
        data: { type: 'mark_correct' | 'mark_incorrect'; action_id: string }[];
        is_executed: boolean;
      };
    };
  },
};

export function initAfterInsertComponent() {
  _.PANEL_WRAPPER = getComponent('.tunkit_panel_wrapper') as HTMLElement;
  _.TEMPLATE_PANEL_WRAPPER = _.PANEL_WRAPPER?.querySelector('.tunkit_template_wrapper') as HTMLElement;
  _.TIMELINE_PANEL_WRAPPER = _.PANEL_WRAPPER!.querySelector('.tunkit_body_note') as HTMLElement;
  _.FULL_OVERLAY_WRAPPER.className = 'tunkit_overlay_wrapper';
  document.body.insertAdjacentElement('afterend', _.FULL_OVERLAY_WRAPPER);
  _.FULL_OVERLAY.className = 'tunkit_overlay opened';
  _.FULL_OVERLAY.style.zIndex = '2201';
  _.DIALOG_WRAPPER.className = 'tunkit_dialog_wrapper';
  document.body.insertAdjacentElement('afterend', _.DIALOG_WRAPPER);
  _.VIDEO = document.querySelector('video') as HTMLVideoElement;
  if (_.VIDEO == null) throw new Error('Can not find video element');
  _.VIDEO_PLAYER = document.querySelector('.html5-video-player');
  if (_.VIDEO_PLAYER == null) throw new Error('Can not find video player element');
  _.TRACK_PANEL_ITEM_WRAPPER = _.PANEL_WRAPPER!.querySelector('.tunkit_track_note_wrapper');
  _.SEGMENT_CORRECT_PANEL = _.PANEL_WRAPPER!.querySelector('.tunkit_segment_correct');
  _.SEGMENT_INCORRECT_PANEL = _.PANEL_WRAPPER!.querySelector('.tunkit_segment_incorrect');
  _.TRACK_SCORE = _.PANEL_WRAPPER!.querySelector('.tunkit_track_score');
}
export default _;
