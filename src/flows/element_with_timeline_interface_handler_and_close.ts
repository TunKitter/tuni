import JumpTimelineInterfaceHandler from '../interface/handler/JumpTimelineInterfaceHandler';
import NotificationInterfaceHandler from '../interface/handler/NotificationInterfaceHandler';
import { ActionDataType } from '../types';

export function ElementWithTimelineInterfaceHandlerAndCloseFlow(
  click_element: HTMLElement,
  action_value: ActionDataType,
  timeline_interface: { setPreventShow: Function; hide: Function }
) {
  let handle_function: Function = function () {};
  switch (action_value.type) {
    case 'notification': {
      handle_function = function () {
        const noti = new NotificationInterfaceHandler(action_value.data);
        timeline_interface.hide();
        timeline_interface.setPreventShow(true);
        noti
          .getElement()
          .getToggleButton()
          .addEventListener('click', function () {
            timeline_interface.setPreventShow(false);
          });
        noti.handle();
      };
      break;
    }
    case 'jump_timeline': {
      handle_function = function () {
        const jump_timeline = new JumpTimelineInterfaceHandler(action_value.data);
        timeline_interface.hide();
        timeline_interface.setPreventShow(true);
        jump_timeline
          .getDrawerElement()
          .getToggleButton()
          .addEventListener('click', function () {
            timeline_interface.setPreventShow(false);
          });
        jump_timeline.handle();
      };
      break;
    }
  }
  click_element.addEventListener('click', () => handle_function());
}
