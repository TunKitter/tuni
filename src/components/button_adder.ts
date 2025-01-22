import { ActionButtonAdderItemType } from '../types.js';
import { _getURL, getComponent } from '../utils.js';

export default function getButtonAdderComponent() {
  const buttonAdder = getComponent('.input_form_wrapper.action_wrapper', false);
  return {
    addNewAction: () => addNewAction(buttonAdder),
    getElement: () => buttonAdder,
    onAddNewAction: (callback: Function) => {
      // @ts-ignore
      buttonAdder.querySelector('#tunkit_add_new_action').onclick = () => {
        const action = addNewAction(buttonAdder);
        callback(action as ActionButtonAdderItemType);
      };
    },
  };
}
function addNewAction(buttonAdder: HTMLElement): ActionButtonAdderItemType {
  const action = getComponent('.tunkit_btn_action_item', false);
  (action.querySelector('.tunkit_btn_action_icon') as HTMLImageElement).src = _getURL('icons/notification.svg');
  buttonAdder.querySelector('.tunkit_action_wrapper')!.appendChild(action);
  return {
    getElement: () => action,
    onClick: (callback: Function) => {
      action.addEventListener('click', () => callback());
    },
    setIcon(icon) {
      (action.querySelector('.tunkit_btn_action_icon') as HTMLImageElement).src = _getURL(`icons/${icon}.svg`);
    },
    setName(name) {
      //@ts-ignore
      action.querySelector('.tunkit_btn_action_name').textContent = name;
    },
  };
}
