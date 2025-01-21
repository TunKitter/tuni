import { getComponent } from '../utils';
import _ from '../variables';

export function getTemplateDialogComponent() {
  const data = { name: '', description: '' };
  const dialog = getComponent('.tunkit_template', false);
  const input_name = dialog.querySelector('.tunkit_template_name') as HTMLInputElement;
  const input_description = dialog.querySelector('.tunkit_template_description') as HTMLTextAreaElement;
  return {
    render() {
      _.DIALOG_WRAPPER.appendChild(dialog);
      dialog.style.display = 'block';
    },
    getInputNameData: () => input_name.value,
    getInputDescriptionData: () => input_description.value,
    getElement: () => dialog,
    getName: () => data.name,
    setName(name: string) {
      data.name = name;
      input_name.value = name;
    },
    getDescription: () => data.description,
    setDescription(description: string) {
      data.description = description;
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
