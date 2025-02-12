import getInputTagsComponent from '../components/input_tags';
import Tags from '../models/Tag';
import { getComponent, HmsToSeconds, insertAdjacentElement, secondsToHms } from '../utils';
import Validate from '../validate/validate_rule';
import _ from '../variables';

export function getBaseTimelineDialog() {
  const dialog = getComponent('.tunkit_timeline_note.base_timeline_dialog', false) as HTMLElement;
  const input_tags = getInputTagsComponent();
  Tags.DATA.GET_ALL({ include_key: false }).then(data => input_tags.setAutoComplete(data));
  insertAdjacentElement(dialog, input_tags.getElement(), '.tunkit_base_info_wrapper');
  const input_name = dialog.querySelector('.tunkit_timeline_note_name')! as HTMLInputElement;
  const input_start_time = dialog.querySelector('.tunkit_input_time.time_start')! as HTMLInputElement;
  const input_end_time = dialog.querySelector('.tunkit_input_time.time_end')! as HTMLInputElement;
  handleValidateInputName(dialog, input_name);
  handleValidateTime(dialog, input_start_time, input_end_time);

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
      dialog.querySelector('.tunkit_save_timeline_btn').onclick = () => {
        if (
          !(
            validateInputName(dialog, input_name) &&
            validateTime(dialog, input_start_time, input_end_time, input_start_time, 'Start') &&
            validateTime(dialog, input_start_time, input_end_time, input_end_time, 'End')
          )
        )
          return;
        callback();
      };
    },
    onClickDelete(callback: Function) {
      //@ts-ignore
      dialog.querySelector('.delete_timeline_button').onclick = () => callback();
    },
  };
}
function validateInputName(dialog: HTMLElement, input_name: HTMLInputElement) {
  return new Validate(dialog.querySelector('.tunkit_base_info_wrapper')!, input_name.value)
    .notEmpty()
    .maxLen(100)
    .validate();
}
function handleValidateInputName(dialog: HTMLElement, input_name: HTMLInputElement) {
  input_name.addEventListener('blur', () => validateInputName(dialog, input_name));
}
function validateTime(
  dialog: HTMLElement,
  input_start_time: HTMLInputElement,
  input_end_time: HTMLInputElement,
  input_time: HTMLInputElement,
  type: 'Start' | 'End'
) {
  return new Validate(dialog.querySelector('.tunkit_base_info_wrapper')!, input_time.value)
    .customValidate(function () {
      const start = HmsToSeconds(input_start_time.value);
      const end = HmsToSeconds(input_end_time.value);
      if (!(typeof start == 'number' && typeof end == 'number' && start < end)) {
        let type_error = '';
        if (isNaN(start)) type_error = 'Start';
        if (isNaN(end)) type_error = 'End';
        if (start > end) {
          type_error = type;
        }
        throw new Error(`${type_error} time is invalid`);
      }
    })
    .validate();
}
function handleValidateTime(dialog: HTMLElement, input_start_time: HTMLInputElement, input_end_time: HTMLInputElement) {
  input_start_time.addEventListener('blur', () =>
    validateTime(dialog, input_start_time, input_end_time, input_start_time, 'Start')
  );
  input_end_time.addEventListener('blur', () =>
    validateTime(dialog, input_start_time, input_end_time, input_end_time, 'End')
  );
}
