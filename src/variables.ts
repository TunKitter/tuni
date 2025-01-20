import { getComponent } from './utils';

const _ = {
  PANEL_WRAPPER: null as HTMLElement | null,
  IS_GET_TEMPLATE: false,
};

export function initAfterInsertComponent() {
  _.PANEL_WRAPPER = getComponent('.tunkit_panel_wrapper') as HTMLElement;
}
export default _;
