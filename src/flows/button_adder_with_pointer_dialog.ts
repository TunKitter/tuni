import { getUpdateActionDialog } from '../dialogs/update_action_dialog';
import { ActionButtonAdderItemType, ActionPointerDataType } from '../types';
import { getComponent, insertAdjacentElement, randomString } from '../utils';
import _ from '../variables';
import { initPointerVideo } from '../video';
import { DialogWithOverlayFlow } from './dialog_with_overlay';

export function ButtonAdderWithPointerDialogActionFlow(
  temp_action: { [key: string]: ActionPointerDataType },
  timeline_dialog: any
) {
  Object.keys(temp_action).forEach(key => {
    const button_adder = timeline_dialog.BUTTON_ADDER.addNewAction();
    button_adder.setName(temp_action[key].name);
    button_adder.setIcon(temp_action[key].type);
    button_adder.onClick(() => handleClickButtonAdder(temp_action, key, button_adder));
  });
  timeline_dialog.BUTTON_ADDER.onAddNewAction(function (button_item: ActionButtonAdderItemType) {
    const action_id = randomString();
    temp_action[action_id] = {
      name: 'No title',
      type: 'notification',
      data: 'Enter you notification here',
      axis: { x: 50, y: 50 },
    };
    button_item.onClick(() => handleClickButtonAdder(temp_action, action_id, button_item));
  });
}
function handleClickButtonAdder(
  temp_action: { [key: string]: ActionPointerDataType },
  action_id: string,
  button_item: ActionButtonAdderItemType
) {
  const action_dialog = getUpdateActionDialog();
  const pointer_button = getComponent('#set_pointer_btn', false);
  pointer_button.onclick = function () {
    (_.DIALOG_WRAPPER as HTMLElement).style.display = 'none';
    (_.FULL_OVERLAY_WRAPPER as HTMLElement).style.display = 'none';
    initPointerVideo(temp_action, action_id);
    _.PANEL_WRAPPER?.classList.remove('tunkit_menu_active');
  };
  insertAdjacentElement(action_dialog.getElement(), pointer_button, '.tunkit_title_action');
  action_dialog.setActionName(temp_action[action_id].name);
  action_dialog.setData(temp_action[action_id].type, temp_action[action_id].data);
  const dialog_flow = DialogWithOverlayFlow(action_dialog.getElement(), {
    close_selector: ['.tunkit_close_action_button'],
    overlay_z_index: 2202,
  });
  action_dialog.onClickUpdate(function () {
    //@ts-ignore
    temp_action[action_id].name = action_dialog.getActionName();
    temp_action[action_id].type = action_dialog.getType();
    temp_action[action_id].data = action_dialog.getData();
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
