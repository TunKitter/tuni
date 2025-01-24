import { getInputTagsWithSelectComponent } from '../components/input_tags_with_select';
import { getComponent, insertAdjacentElement } from '../utils';
import { getBaseTimelineDialog } from './base_timeline_dialog';

export function getTypingTimelineDialog() {
  const base_timeline = getBaseTimelineDialog();
  const typing_component = getComponent('.panel_timeline_typing', false);
  insertAdjacentElement(base_timeline.getElement(), typing_component, '.tunkit_input_tags_wrapper');
  const question_typing_input = typing_component.querySelector(
    '.tunkit_timeline_typing_card_question'
  ) as HTMLTextAreaElement;
  //@ts-ignore
  return {
    BASE: base_timeline,
    render() {
      base_timeline.render();
    },
    getDataTimeline() {
      return question_typing_input.value;
    },
    setDataTimeline(value: string) {
      question_typing_input.value = value;
    },
    onAddNewAnswerItem(callback: Function) {
      //@ts-ignore
      typing_component.querySelector('#tunkit_add_new_action_typing').onclick = function () {
        const answer_item = renderAnswerItem(base_timeline);
        callback(answer_item);
      };
    },
    renderAnswerItem: () => renderAnswerItem(base_timeline),
  };
}

export function renderAnswerItem(base_timeline: ReturnType<typeof getBaseTimelineDialog>) {
  const typing_answer_item = getInputTagsWithSelectComponent();
  typing_answer_item.setOptionSelect(['equal', 'Equal']);
  typing_answer_item.setOptionSelect(['otherwise', 'Otherwise']);
  base_timeline
    .getElement()
    .querySelector('.tunkit_action_typing_wrapper')!
    .appendChild(typing_answer_item.getElement());
  return {
    answerItem: typing_answer_item,
  };
}
