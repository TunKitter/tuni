import { handleShowPanel } from '../panels/panel';
import { ActionType } from '../types';
import { getComponent, HmsToSeconds, secondsToHms } from '../utils';
import _ from '../variables';

export function getUpdateActionDialog() {
  const detailAction = getComponent('.tunkit_detail_timeline_note', false);
  const action_name = detailAction.querySelector('.tunkit_action_name') as HTMLInputElement;
  handleShowPanel(detailAction, (element: Element, show: Function) => show());
  handleChangeViewAction(detailAction);
  return {
    render() {
      _.DIALOG_WRAPPER.appendChild(detailAction);
      detailAction.style.display = 'block';
    },
    getActionName: () => action_name.value,
    setActionName: (name: string) => (action_name.value = name),
    getElement: () => detailAction,
    getType: () => (detailAction.querySelector('#tunkit_select_action_type') as HTMLSelectElement).value as ActionType,
    getData: function () {
      const type = this.getType();
      return handleDataInteractiveData(type as ActionType, detailAction);
    },
    setData: (type: ActionType, data: any) => {
      setTimeout(() => {
        (detailAction.querySelector(`#tunkit_action_${type}_hidden`) as HTMLElement)?.click();
      }, 0);
      (detailAction.querySelector('#tunkit_select_action_type') as HTMLSelectElement).value = type;
      handleDataInteractiveData(type, detailAction, data);
    },
    onClickClose: function (callback: Function) {
      (detailAction!.querySelector('.tunkit_close_action_button')! as HTMLElement).onclick = () => callback();
    },
    onClickUpdate: function (callback: Function) {
      (detailAction!.querySelector('.save_action_button')! as HTMLElement).onclick = () => callback();
    },
    onClickDelete: function (callback: Function) {
      (detailAction!.querySelector('.delete_action_button')! as HTMLElement).onclick = () => callback();
    },
  };
}
function handleChangeViewAction(detailAction: HTMLElement) {
  (detailAction.querySelector('#tunkit_select_action_type') as HTMLSelectElement)?.addEventListener(
    'change',
    function () {
      (detailAction.querySelector(`#tunkit_action_${this.value}_hidden`) as HTMLElement)?.click();
    }
  );
}
function handleDataInteractiveData(type: ActionType, detailAction: HTMLElement, data: any = undefined) {
  switch (type) {
    case 'notification': {
      const input = detailAction.querySelector('.tunkit_action_notification_content') as HTMLTextAreaElement;
      if (typeof data !== 'string' && typeof data !== 'undefined')
        throw new Error('Data must be string on Notification action');
      else if (typeof data === 'undefined') return input.value;
      input.value = data;
      break;
    }
    case 'jump_timeline': {
      const timeline_input = detailAction.querySelector('.tunkit_action_jump_timeline_content') as HTMLInputElement;
      const timeline_message = detailAction.querySelector('.tunkit_jump_timeline_message') as HTMLTextAreaElement;
      if (typeof data !== 'object' && typeof data !== 'undefined')
        throw new Error('Data must be string on Jump timeline action');
      else if (typeof data === 'undefined')
        return {
          message: timeline_message.value,
          timeline: HmsToSeconds(timeline_input.value),
        };
      timeline_input.value = secondsToHms(String(data.timeline));
      timeline_message.value = data.message;
      break;
    }
    case 'mark_correct':
    case 'mark_incorrect': {
      if (typeof data === 'undefined') return true;
      break;
    }
  }
}
function renderReferenceAction() {
  const reference_action_item = getComponent('.tunkit_reference_note_item', false);
  const template = getComponent('.tunkit_reference_note_template_item', false);
  const timeline = getComponent('.tunkit_reference_note_timeline_note_item', false);
  template.querySelector('.content')?.appendChild(timeline);
  template.querySelector('.content')?.appendChild(timeline.cloneNode(true));
  reference_action_item.appendChild(template);
  return reference_action_item;
}
