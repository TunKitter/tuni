import { getUpdateActionDialog } from '../dialogs/update_action_dialog';
import { ActionButtonAdderItemType, ActionDataType } from '../types';
import { randomString } from '../utils';
import { DialogWithOverlayFlow } from './dialog_with_overlay';

export function ButtonAdderWithDialogActionFlow(
  temp_action: { [key: string]: ActionDataType },
  message_timeline_dialog: any
) {
  Object.keys(temp_action).forEach(key => {
    const button_adder = message_timeline_dialog.BUTTON_ADDER.addNewAction();
    button_adder.setName(temp_action[key].name);
    button_adder.setIcon(temp_action[key].type);
    button_adder.onClick(() => handleClickButtonAdder(temp_action, key, button_adder));
  });
  message_timeline_dialog.BUTTON_ADDER.onAddNewAction(function (button_item: ActionButtonAdderItemType) {
    const action_id = randomString();
    temp_action[action_id] = {
      name: 'No title',
      type: 'notification',
      data: 'Enter you notification here',
    };
    button_item.onClick(() => handleClickButtonAdder(temp_action, action_id, button_item));
  });
}
function handleClickButtonAdder(
  temp_action: { [key: string]: ActionDataType },
  action_id: string,
  button_item: ActionButtonAdderItemType
) {
  const action_dialog = getUpdateActionDialog();
  action_dialog.setActionName(temp_action[action_id].name);
  action_dialog.setData(temp_action[action_id].type, temp_action[action_id].data);
  const dialog_flow = DialogWithOverlayFlow(action_dialog.getElement(), {
    close_selector: ['.tunkit_close_action_button'],
    overlay_z_index: 2202,
  });
  action_dialog.onClickUpdate(function () {
    temp_action[action_id] = {
      name: action_dialog.getActionName(),
      type: action_dialog.getType(),
      data: action_dialog.getData(),
    };
    dialog_flow.removeDialog();
    dialog_flow.removeOverlay();
    button_item.setName(temp_action[action_id].name);
    button_item.setIcon(temp_action[action_id].type);
  });
  action_dialog.onClickDelete(function () {
    if (confirm('Are you sure want to delete this action?')) {
      delete temp_action[action_id];
      button_item.getElement().remove();
      dialog_flow.removeDialog();
      dialog_flow.removeOverlay();
    }
  });
  action_dialog.render();
}
