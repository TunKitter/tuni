import { getComponent } from '../utils';
import _ from '../variables';

export function getTemplateDialogComponent() {
  const dialog = getComponent('.tunkit_template', false);
  const input_name = dialog.querySelector('.tunkit_template_name') as HTMLInputElement;
  const input_description = dialog.querySelector('.tunkit_template_description') as HTMLTextAreaElement;
  return {
    render() {
      _.DIALOG_WRAPPER.appendChild(dialog);
      dialog.style.display = 'block';
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
      dialog.querySelector('.tunkit_save_template').onclick = () => callback();
    },
    onClickDelete(callback: Function) {
      //@ts-ignore
      dialog.querySelector('.tunkit_delete_template').onclick = () => callback();
    },
  };
}
