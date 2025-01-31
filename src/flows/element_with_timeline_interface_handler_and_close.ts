import JumpTimelineInterfaceHandler from '../interface/handler/JumpTimelineInterfaceHandler';
import MarkCorrectActionHandler from '../interface/handler/MarkCorrectInterfaceHandler';
import MarkIncorrectActionHandler from '../interface/handler/MarkIncorrectInterfaceHandler';
import NotificationInterfaceHandler from '../interface/handler/NotificationInterfaceHandler';
import ReferenceTimelineInterfaceHandler from '../interface/handler/ReferenceTimelineInterfaceHandler';
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
    case 'reference_note': {
      handle_function = function () {
        const ref = new ReferenceTimelineInterfaceHandler(action_value.data);
        timeline_interface.hide();
        timeline_interface.setPreventShow(true);
        ref
          .getElement()
          .getToggleButton()
          .addEventListener('click', function () {
            timeline_interface.setPreventShow(false);
          });
        ref.handle();
      };
      break;
    }
    case 'mark_correct': {
      handle_function = function () {
        const correct_ = new MarkCorrectActionHandler(action_value);
        timeline_interface.hide();
        timeline_interface.setPreventShow(true);
        setTimeout(() => {
          timeline_interface.setPreventShow(false);
          correct_.removeElement();
        }, 2000);
        correct_.handle();
      };
      break;
    }
    case 'mark_incorrect': {
      handle_function = function () {
        const correct_ = new MarkIncorrectActionHandler(action_value);
        timeline_interface.hide();
        timeline_interface.setPreventShow(true);
        setTimeout(() => {
          timeline_interface.setPreventShow(false);
          correct_.removeElement();
        }, 2000);
        correct_.handle();
      };
      break;
    }
  }
  click_element.addEventListener('click', () => handle_function());
}
