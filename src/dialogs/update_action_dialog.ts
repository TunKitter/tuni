import Timeline from '../models/Timeline';
import Youtube from '../models/Youtube';
import { handleShowPanel } from '../panels/panel';
import { ActionType } from '../types';
import { getComponent, HmsToSeconds, secondsToHms } from '../utils';
import _ from '../variables';

export function getUpdateActionDialog() {
  const detailAction = getComponent('.tunkit_detail_timeline_note', false);
  const action_name = detailAction.querySelector('.tunkit_action_name') as HTMLInputElement;
  handleShowPanel(detailAction, (element: Element, show: Function) => show());
  handleChangeViewAction(detailAction);
  renderReferenceAction().then(element => {
    detailAction.querySelector('.panel_action_reference_note')?.appendChild(element as HTMLElement);
  });
  //@ts-ignore
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
    case 'reference_note': {
      if (typeof data === 'undefined') {
        const selected_element = getSelectedElement(detailAction);
        const return_data = {
          timeline_id: selected_element.timeline_id.id,
          template_id: selected_element.template_id.id,
          youtube_id: selected_element.youtube_id.id,
        };
        return return_data;
      } else {
        const timeout_check = setTimeout(() => {
          const checked_timeline = detailAction.querySelector(
            `input[type="radio"].tunkit_checkbox#${data.timeline_id}`
          ) as HTMLInputElement;
          if (checked_timeline !== null) {
            clearTimeout(timeout_check);
            checked_timeline.checked = true;
            const selected_element = getSelectedElement(detailAction);
            selected_element.template_id.setAttribute('open', 'true');
            selected_element.youtube_id.setAttribute('open', 'true');
          }
        }, 10);
      }
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
  if (_.TEMP_REFERENCE_ACTION_ELEMENT !== null)
    return new Promise(ok => {
      ok(_.TEMP_REFERENCE_ACTION_ELEMENT!.cloneNode(true));
    });
  return Youtube.getAll().then(data => {
    const frag = document.createDocumentFragment();
    Object.keys(data).forEach(key => {
      const reference_action_item = getComponent('.tunkit_reference_note_item', false);
      reference_action_item.id = key;
      reference_action_item.querySelector('.title')!.textContent = data[key].title;
      const template_len = Object.keys(data[key].template).length;
      reference_action_item.querySelector('.total_template_reference_note')!.textContent = `${template_len} template${
        template_len > 1 ? 's' : ''
      }`;
      reference_action_item
        .querySelector('.thumbnail img')!
        .setAttribute('src', `https://img.youtube.com/vi/${key.substring(3)}/0.jpg`);
      Object.keys(data[key].template).forEach(template_id => {
        const template_data = data[key].template[template_id];
        const template = getComponent('.tunkit_reference_note_template_item', false);
        template.id = template_id;
        template.querySelector('.item-info .title')!.textContent = template_data.name;
        template.querySelector('.item-info .views')!.textContent = template_data.description;
        Object.keys(template_data.timelineNotes).forEach(timeline_id => {
          const timeline_data = template_data.timelineNotes[timeline_id];
          const timeline_len = Object.keys(template_data.timelineNotes).length;
          reference_action_item.querySelector(
            '.total_timeline_note_reference_note'
          )!.textContent = `${timeline_len} timeline note${timeline_len > 1 ? 's' : ''}`;
          const timeline = getComponent('.tunkit_reference_note_timeline_note_item', false);
          timeline.querySelector('.child-title')!.textContent = timeline_data.name;
          timeline.querySelector('.type')!.textContent = Timeline.GETNAME[timeline_data.type];
          timeline.querySelector('.timeline')!.textContent = secondsToHms(String(timeline_data.startTime));
          timeline.setAttribute('for', timeline_id);
          timeline.querySelector('input[type="radio"]')!.id = timeline_id;
          // document.querySelector('input[type="radio"][name="reference_note"].tunkit_checkbox:checked').id
          template.querySelector('.content')?.appendChild(timeline);
        });
        reference_action_item.appendChild(template);
      });
      frag.appendChild(reference_action_item);
    });
    //@ts-ignore
    _.TEMP_REFERENCE_ACTION_ELEMENT = frag.cloneNode(true);
    return frag;
  });
}
function getSelectedElement(detailAction: HTMLElement) {
  const timeline_id = detailAction.querySelector('input[type="radio"][name="reference_note"].tunkit_checkbox:checked');
  if (timeline_id == null) throw new Error('Not found the selected timeline');
  const template_id = timeline_id!.parentElement!.parentElement!.parentElement!.parentElement;
  if (template_id == null || !template_id?.classList?.contains('tunkit_reference_note_template_item'))
    throw new Error('Not found the selected template');
  const youtube_id = template_id!.parentElement;
  if (youtube_id == null || !youtube_id?.classList?.contains('tunkit_reference_note_item'))
    throw new Error('Not found the selected youtube');
  return {
    timeline_id: timeline_id,
    template_id: template_id,
    youtube_id: youtube_id,
  };
}
