import { getTypingTimelineDialog, renderAnswerItem } from '../dialogs/typing_timeline_dialog';
import { getUpdateActionDialog } from '../dialogs/update_action_dialog';
import { ActionDataType, ActionTypingDataType } from '../types';
import { randomString } from '../utils';
import { DialogWithOverlayFlow } from './dialog_with_overlay';

export function InputTagSelectWithDialogFlow(
  temp_action: { [key: string]: ActionTypingDataType },
  timeline_dialog: ReturnType<typeof getTypingTimelineDialog>
) {
  Object.keys(temp_action).forEach(key => {
    const answer_item = timeline_dialog.renderAnswerItem();
    answer_item.answerItem.INPUT_TAGS.setData(temp_action[key].include);
    handleCheckSelectType(key, temp_action, answer_item);
    answer_item.answerItem.setType(temp_action[key].select_type);
    answer_item.answerItem.onClickSetting(() => handleClickAnswerItem(temp_action, key, answer_item));
  });
  timeline_dialog.onAddNewAnswerItem(function (button_item: ReturnType<typeof renderAnswerItem>) {
    const action_id = randomString();
    temp_action[action_id] = {
      name: 'No title',
      type: 'notification',
      data: 'Enter you notification here',
      select_type: 'equal',
      include: button_item.answerItem.INPUT_TAGS.getData(),
    };
    handleCheckSelectType(action_id, temp_action, button_item);
    button_item.answerItem.onClickSetting(() => handleClickAnswerItem(temp_action, action_id, button_item));
  });
}
function handleClickAnswerItem(
  temp_action: { [key: string]: ActionDataType },
  action_id: string,
  button_item: ReturnType<typeof renderAnswerItem>
) {
  const action_dialog = getUpdateActionDialog();
  action_dialog.setActionName(temp_action[action_id].name);
  action_dialog.setData(temp_action[action_id].type, temp_action[action_id].data);
  const dialog_flow = DialogWithOverlayFlow(action_dialog.getElement(), {
    close_selector: ['.tunkit_close_action_button'],
    overlay_z_index: 2202,
  });
  action_dialog.onClickUpdate(function () {
    temp_action[action_id].name = action_dialog.getActionName();
    temp_action[action_id].type = action_dialog.getType();
    temp_action[action_id].data = action_dialog.getData();
    dialog_flow.removeDialog();
    dialog_flow.removeOverlay();
  });
  action_dialog.onClickDelete(function () {
    if (confirm('Are you sure want to delete this typing answer?')) {
      delete temp_action[action_id];
      button_item.answerItem.getElement().remove();
      dialog_flow.removeDialog();
      dialog_flow.removeOverlay();
    }
  });
  action_dialog.render();
}
function handleCheckSelectType(
  key: string,
  temp_action: { [key: string]: ActionTypingDataType },
  button_item: ReturnType<typeof renderAnswerItem>
) {
  const select_element = button_item.answerItem.getSelectElement();
  select_element.addEventListener('change', function () {
    button_item.answerItem.INPUT_TAGS.getElement().style.display =
      select_element.value == 'otherwise' ? 'none' : 'block';
  });
  button_item.answerItem.getSelectElement().addEventListener('change', function () {
    if (select_element.value == 'otherwise') {
      let is_oke = true;
      for (let action_key in temp_action) {
        if (temp_action[action_key].select_type == 'otherwise') {
          alert('Just one "otherwise" is allowed');
          is_oke = false;
          select_element.value = 'equal';
          button_item.answerItem.INPUT_TAGS.getElement().style.display = 'block';
          break;
        }
      }
      //@ts-ignore
      is_oke && void (temp_action[key].select_type = select_element.value);
      //@ts-ignore
    } else temp_action[key].select_type = select_element.value;
  });
}
