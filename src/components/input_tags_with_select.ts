import { getComponent, insertAdjacentElement } from '../utils';
import getInputTagsComponent from './input_tags';

export function getInputTagsWithSelectComponent() {
  const wrapper = getComponent('.tunkit_action_typing_item', false);
  const select_type = wrapper.querySelector('.select_type_input_tag_with_select') as HTMLSelectElement;
  const input_tags = getInputTagsComponent();
  input_tags.getElement().querySelector('label')!.remove();
  //@ts-ignore
  input_tags.getElement().querySelector('#tunkit_select_folder_wrapper')!.style.marginTop = '0';
  insertAdjacentElement(wrapper, input_tags.getElement(), '.tunkit_action_typing_item_left');
  return {
    getElement: () => wrapper,
    INPUT_TAGS: input_tags,
    getSelectElement: () => select_type,
    setOptionSelect(option: [string, string]) {
      const option_select = document.createElement('option');
      option_select.value = option[0];
      option_select.textContent = option[1];
      select_type.appendChild(option_select);
    },
    setType: (type: string) => {
      if (select_type.querySelector('option[value="' + type + '"]') === null) throw new Error('Type not found');
      select_type.value = type;
    },
    onClickSetting(callback: Function) {
      //@ts-ignore 
      wrapper.querySelector('.tunkit_setting_action_typing').onclick = () => callback();
    },
  };
}
