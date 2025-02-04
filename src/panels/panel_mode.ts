import _ from '../variables';

export function handleModePanel() {
  autoPauseInit();
}
function handleCheckboxChange(wrapper: HTMLElement) {
  const status = wrapper.getAttribute('aria-checked') == 'false';
  wrapper.setAttribute('aria-checked', status ? 'true' : 'false');
  return status;
}
function autoPauseInit() {
  // @ts-ignore
  _.PANEL_WRAPPER.querySelector('.panel_mode .auto_pause_mode').onclick = () => {
    // @ts-ignore
    const is_active = handleCheckboxChange(
      // @ts-ignore
      _.PANEL_WRAPPER!.querySelector('.panel_mode .auto_pause_mode #tunkit_toggle_auto_pause')
    );
    _.MODE_DATA_PANEL.auto_pause.state = is_active;
    _.MODE_DATA_PANEL.auto_pause.is_executed = false;
  };
}
export function autoPauseHandler() {
  if (_.MODE_DATA_PANEL.auto_pause.state && !_.MODE_DATA_PANEL.auto_pause.is_executed) {
    _.VIDEO!.pause();
    _.MODE_DATA_PANEL.auto_pause.is_executed = true;
  }
}
