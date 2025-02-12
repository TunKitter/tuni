import getButtonAdderComponent from '../components/button_adder';
import { insertAdjacentElement } from '../utils';
import _ from '../variables';
import { getBaseTimelineDialog } from './base_timeline_dialog';

export function getPointerTimelineDialog() {
  const base_timeline = getBaseTimelineDialog();
  const button_adder = getButtonAdderComponent();
  insertAdjacentElement(base_timeline.getElement(), button_adder.getElement(), '.tunkit_input_tags_wrapper');
  return {
    BASE: base_timeline,
    BUTTON_ADDER: button_adder,
    render() {
      base_timeline.render();
    },
    validateData() {
      return true;
    },
  };
}
