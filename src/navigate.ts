import { setCurrentTemplate, setCurrentTotalNotes, setDisableItems, showPanel } from './panels/panel';
import _ from './variables';

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
  });
}
