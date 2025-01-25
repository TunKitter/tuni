import getInputTagsComponent from '../components/input_tags';
import { getComponent, HmsToSeconds, insertAdjacentElement, secondsToHms } from '../utils';
import _ from '../variables';

export function getBaseTimelineDialog() {
  const dialog = getComponent('.tunkit_timeline_note.base_timeline_dialog', false) as HTMLElement;
  const input_tags = getInputTagsComponent();
  insertAdjacentElement(dialog, input_tags.getElement(), '.tunkit_base_info_wrapper');
  const input_name = dialog.querySelector('.tunkit_timeline_note_name')! as HTMLInputElement;
  const input_start_time = dialog.querySelector('.tunkit_input_time.time_start')! as HTMLInputElement;
  const input_end_time = dialog.querySelector('.tunkit_input_time.time_end')! as HTMLInputElement;
  return {
    render() {
      _.DIALOG_WRAPPER.appendChild(dialog);
      dialog.style.display = 'block';
      _.VIDEO!.pause();
    },
    INPUT_TAG: input_tags,
    getElement: () => dialog,
    getName: () => input_name.value,
    getStartTime: () => HmsToSeconds(input_start_time.value),
    getEndTime: () => HmsToSeconds(input_end_time.value),
    setTitle(title: string) {
      //@ts-ignore
      dialog.querySelector('#tunkit_title_timeline').innerText = title;
    },
    setName(name: string) {
      input_name.value = name;
    },
    setStartTime(time: number) {
      input_start_time.value = secondsToHms(String(time));
    },
    setEndTime(time: number) {
      input_end_time.value = secondsToHms(String(time));
    },
    onClickSave(callback: Function) {
      //@ts-ignore
      dialog.querySelector('.tunkit_save_timeline_btn').onclick = () => callback();
    },
    onClickDelete(callback: Function) {
      //@ts-ignore
      dialog.querySelector('.delete_timeline_button').onclick = () => callback();
    },
  };
}
