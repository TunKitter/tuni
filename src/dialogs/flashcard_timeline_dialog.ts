import getButtonAdderComponent from '../components/button_adder';
import { getComponent, insertAdjacentElement } from '../utils';
import _ from '../variables';
import { getBaseTimelineDialog } from './base_timeline_dialog';

export function getFlashcardTimelineDialog() {
  const base_timeline = getBaseTimelineDialog();
  const flashcard_component = getComponent('.panel_timeline_flashcard', false);
  const front_card = flashcard_component.querySelector('.tunkit_timeline_flashcard_front_card') as HTMLTextAreaElement;
  const back_card = flashcard_component.querySelector('.tunkit_timeline_flashcard_back_card') as HTMLTextAreaElement;
  const button_adder = getButtonAdderComponent();
  insertAdjacentElement(base_timeline.getElement(), flashcard_component, '.tunkit_input_tags_wrapper');
  insertAdjacentElement(base_timeline.getElement(), button_adder.getElement(), '.panel_timeline_flashcard');
  return {
    BASE: base_timeline,
    BUTTON_ADDER: button_adder,
    render() {
      base_timeline.render();
    },
    getDataTimeline() {
      return {
        front: front_card.value,
        back: back_card.value,
      };
    },
    setDataTimeline(data: { front: string; back: string }) {
      front_card.value = data.front;
      back_card.value = data.back;
    },
  };
}
