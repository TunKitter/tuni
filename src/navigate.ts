import { setCurrentTemplate, setDisableItems, showPanel } from './panels/panel';
import _ from './variables';

export default function handleNavigate() {
  // @ts-ignore
  navigation.addEventListener('navigate', () => {
    (_.PANEL_WRAPPER as HTMLElement)?.classList.remove('tunkit_menu_active');
    setDisableItems(_.PANEL_WRAPPER as HTMLElement, '.tunkit_disable_for_template', true);
    setCurrentTemplate('Off');
    showPanel('.tunkit_panel.panel_main', 'tunkit_panel_active');
    _.IS_GET_TEMPLATE = false;
    _.CURRENT_TEMPLATE_ID = null;
    _.FULL_OVERLAY_WRAPPER.innerHTML = '';
    _.DIALOG_WRAPPER.innerHTML = '';
    _.TEMPLATE_PANEL_WRAPPER!.innerHTML = '';
  });
}
