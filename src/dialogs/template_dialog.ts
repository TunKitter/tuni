import { getComponent } from '../utils';
import Validate from '../validate/validate_rule';
import _ from '../variables';

export function getTemplateDialogComponent() {
  const dialog = getComponent('.tunkit_template', false);
  const input_name = dialog.querySelector('.tunkit_template_name') as HTMLInputElement;
  const input_description = dialog.querySelector('.tunkit_template_description') as HTMLTextAreaElement;
  input_name.addEventListener('blur', () =>
    new Validate(input_name, input_name.value).notEmpty().maxLen(100).validate()
  );
  input_description.addEventListener('blur', () =>
    new Validate(input_description, input_description.value).maxLen(1000).validate()
  );
  return {
    render() {
      _.DIALOG_WRAPPER.appendChild(dialog);
      dialog.style.display = 'block';
      _.VIDEO!.pause();
    },
    getName: () => input_name.value,
    getDescription: () => input_description.value,
    getElement: () => dialog,
    setName(name: string) {
      input_name.value = name;
    },
    setDescription(description: string) {
      input_description.value = description;
    },
    onClickClose(callback: Function) {
      //@ts-ignore
      dialog.querySelector('.tunkit_close_template').onclick = () => callback();
    },
    onClickSubmit(callback: Function) {
      //@ts-ignore
      dialog.querySelector('.tunkit_save_template').onclick = () => {
        if (
          !(
            new Validate(input_name, input_name.value).notEmpty().maxLen(100).validate() &&
            new Validate(input_description, input_description.value).maxLen(1000).validate()
          )
        )
          return;
        callback();
      };
    },
    onClickDelete(callback: Function) {
      //@ts-ignore
      dialog.querySelector('.tunkit_delete_template').onclick = () => callback();
    },
  };
}
