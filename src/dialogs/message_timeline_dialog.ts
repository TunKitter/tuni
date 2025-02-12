import getButtonAdderComponent from '../components/button_adder';
import { getComponent, insertAdjacentElement } from '../utils';
import Validate from '../validate/validate_rule';
import _ from '../variables';
import { getBaseTimelineDialog } from './base_timeline_dialog';

export function getMessageTimelineDialog() {
  const base_timeline = getBaseTimelineDialog();
  const message_component = getComponent('.panel_timeline_message', false);
  const message_timeline_textarea = message_component.querySelector('.tunkit_timeline_message') as HTMLTextAreaElement;
  message_timeline_textarea.addEventListener('blur', () =>
    new Validate(message_timeline_textarea, message_timeline_textarea.value).notEmpty().maxLen(100).validate()
  );
  const button_adder = getButtonAdderComponent();
  insertAdjacentElement(base_timeline.getElement(), message_component, '.tunkit_input_tags_wrapper');
  insertAdjacentElement(base_timeline.getElement(), button_adder.getElement(), '.panel_timeline_message');
  return {
    BASE: base_timeline,
    BUTTON_ADDER: button_adder,
    render() {
      base_timeline.render();
    },
    getDataTimeline() {
      return message_timeline_textarea.value;
    },
    validateData() {
      return new Validate(message_timeline_textarea, message_timeline_textarea.value).notEmpty().maxLen(100).validate();
    },
    setDataTimeline(value: string) {
      message_timeline_textarea.value = value;
    },
  };
}
