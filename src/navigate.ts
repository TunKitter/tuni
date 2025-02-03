import { setCurrentTemplate, setCurrentTotalNotes, setDisableItems, showPanel } from './panels/panel';
import { resetPanelScore } from './panels/panel_track';
import _ from './variables';
import { activeTimelineInVideo } from './video';

export default function handleNavigate() {
  // @ts-ignore
  navigation.addEventListener('navigate', () => {
    (_.PANEL_WRAPPER as HTMLElement)?.classList.remove('tunkit_menu_active');
    showPanel('.tunkit_panel.panel_main', 'tunkit_panel_active');
    _.IS_GET_TEMPLATE = false;
    setDisableItems(_.PANEL_WRAPPER as HTMLElement, '.tunkit_disable_for_template', true);
    setCurrentTemplate('Off');
    setCurrentTotalNotes('Off');
    _.IS_GET_TIMELINE = false;
    _.CURRENT_TEMPLATE_ID = null;
    _.TIMELINE_NOTE = {};
    _.FULL_OVERLAY_WRAPPER.innerHTML = '';
    _.DIALOG_WRAPPER.innerHTML = '';
    removeAllInteractionElements();
    activeTimelineInVideo({ playing: 'remove', timeout: 'clear', video: 'remove' });
    resetPanelScore();
  });
}
export function removeAllInteractionElements() {
  _.VIDEO_PLAYER?.querySelectorAll('.tunkit_timeline_interface').forEach(e => e.remove());
  _.VIDEO_PLAYER?.querySelectorAll('.tunkit_timeline_action_wrapper').forEach(e => e.remove());
  _.VIDEO_PLAYER?.querySelectorAll('.tunkit_action_handler').forEach(e => e.remove());
  _.VIDEO_PLAYER?.querySelectorAll('.tunkit_player_correct_and_incorrect').forEach(e => e.remove());
  _.VIDEO_PLAYER?.querySelectorAll('.tunkit_player_overlay').forEach(e => e.remove());
  _.VIDEO_PLAYER?.querySelectorAll('.tunkit_pointer_wrapper').forEach(e => e.remove());
  _.VIDEO_PLAYER?.querySelectorAll('.tunkit_pointer_overlay').forEach(e => e.remove());
  _.VIDEO_PLAYER?.querySelectorAll('.tunkit_pointer_buttons').forEach(e => e.remove());
  _.VIDEO_PLAYER?.querySelectorAll('.tunkit_pointer_child').forEach(e => e.remove());
}
