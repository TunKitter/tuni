import { getComponent } from './utils';

const _ = {
  PANEL_WRAPPER: null as HTMLElement | null,
  IS_GET_TEMPLATE: false,
  TEMPLATE_PANEL_WRAPPER: null as HTMLElement | null,
};

export function initAfterInsertComponent() {
  _.PANEL_WRAPPER = getComponent('.tunkit_panel_wrapper') as HTMLElement;
  _.TEMPLATE_PANEL_WRAPPER = _.PANEL_WRAPPER?.querySelector('.tunkit_template_wrapper') as HTMLElement;
}
export default _;
