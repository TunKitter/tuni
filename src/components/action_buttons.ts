import { ActionDataType } from '../types';
import { _getURL } from '../utils';
import _ from '../variables';

export function getActionButtons() {
  const action_button = document.createElement('div');
  action_button.className = 'tunkit_timeline_interface tunkit_timeline_action_wrapper';
  let action_data = {} as {
    [key: string]: {
      element: HTMLElement;
      data: ActionDataType;
    };
  };
  return {
    render() {
      _.VIDEO_PLAYER!.appendChild(action_button);
    },
    show() {
      action_button.style.bottom = '0';
    },
    hide() {
      action_button.style.bottom = '-100%';
    },
    getActionData: () => action_data,
    setActionData(_action_data: { [key: string]: ActionDataType }) {
      Object.keys(action_data).forEach(key => void action_data[key].element.remove());
      action_data = {};
      Object.keys(_action_data).forEach(key => {
        switch (_action_data[key].type) {
          case 'notification':
            this.addNotificationAction(key, _action_data[key]);
            break;
          case 'jump_timeline':
            this.addJumpTimelineAction(key, _action_data[key]);
            break;
        }
      });
    },
    getElement: () => action_button,
    addNotificationAction(key: string, value: ActionDataType) {
      const noti = document.createElement('div');
      noti.className = 'tunkit_action_interface tunkit_action_notification_interface';
      noti.innerHTML = `<img src="${_getURL('icons/notification_white.svg')}"/> ${value.name}`;
      action_button.appendChild(noti);
      action_data[key] = {
        element: noti,
        data: value,
      };
    },
    addJumpTimelineAction(key: string, value: ActionDataType) {
      const action = document.createElement('div');
      action.className = 'tunkit_action_interface tunkit_action_jump_timeline_interface';
      action.innerHTML = `<img src="${_getURL('icons/jump_timeline_white.svg')}"> ${value.data.message}`;
      action_button.appendChild(action);
      action_data[key] = {
        element: action,
        data: value,
      };
    },
  };
}
