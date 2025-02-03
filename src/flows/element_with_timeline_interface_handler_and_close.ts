import JumpTimelineInterfaceHandler from '../interface/handler/JumpTimelineInterfaceHandler';
import MarkCorrectActionHandler from '../interface/handler/MarkCorrectInterfaceHandler';
import MarkIncorrectActionHandler from '../interface/handler/MarkIncorrectInterfaceHandler';
import NotificationInterfaceHandler from '../interface/handler/NotificationInterfaceHandler';
import ReferenceTimelineInterfaceHandler from '../interface/handler/ReferenceTimelineInterfaceHandler';
import { getTrackScoreItemComponent, setSegmentScore } from '../panels/panel_track';
import { ActionDataType } from '../types';
import _ from '../variables';

export function ElementWithTimelineInterfaceHandlerAndCloseFlow(
  click_element: HTMLElement | null,
  action_key: string,
  action_value: ActionDataType,
  timeline_interface: { setPreventShow: Function; hide: Function } | null
) {
  let handle_function: Function = function () {};
  switch (action_value.type) {
    case 'notification': {
      handle_function = function () {
        const noti = new NotificationInterfaceHandler(action_value.data);
        if (timeline_interface !== null) {
          timeline_interface.hide();
          timeline_interface.setPreventShow(true);
          noti
            .getElement()
            .getToggleButton()
            .addEventListener('click', function () {
              timeline_interface.setPreventShow(false);
            });
        }

        noti.handle();
      };
      break;
    }
    case 'jump_timeline': {
      handle_function = function () {
        const jump_timeline = new JumpTimelineInterfaceHandler(action_value.data);
        if (timeline_interface !== null) {
          timeline_interface.hide();
          timeline_interface.setPreventShow(true);
          jump_timeline
            .getDrawerElement()
            .getToggleButton()
            .addEventListener('click', function () {
              timeline_interface.setPreventShow(false);
            });
        }

        jump_timeline.handle();
      };
      break;
    }
    case 'reference_note': {
      handle_function = function () {
        const ref = new ReferenceTimelineInterfaceHandler(action_value.data);
        if (timeline_interface !== null) {
          timeline_interface.hide();
          timeline_interface.setPreventShow(true);
          ref
            .getElement()
            .getToggleButton()
            .addEventListener('click', function () {
              timeline_interface.setPreventShow(false);
            });
        }
        ref.handle();
      };
      break;
    }
    case 'mark_correct': {
      handle_function = function () {
        const correct_ = new MarkCorrectActionHandler(action_value);
        if (timeline_interface !== null) {
          timeline_interface.hide();
          timeline_interface.setPreventShow(true);
        }
        correct_.handle();
        setTimeout(() => {
          if (timeline_interface !== null) timeline_interface.setPreventShow(false);
          handleScorePanel(action_key);
          correct_.removeElement();
        }, 2000);
      };
      break;
    }
    case 'mark_incorrect': {
      handle_function = function () {
        const incorrect_ = new MarkIncorrectActionHandler(action_value);
        if (timeline_interface !== null) {
          timeline_interface.hide();
          timeline_interface.setPreventShow(true);
        }
        setTimeout(() => {
          if (timeline_interface !== null) timeline_interface.setPreventShow(false);
          handleScorePanel(action_key);
          incorrect_.removeElement();
        }, 2000);
        incorrect_.handle();
      };
      break;
    }
  }
  if (click_element !== null) click_element.addEventListener('click', () => handle_function());
  else handle_function();
}
function handleScorePanel(action_key: string) {
  Object.values(_.TEMP_SCORE_DATA.timeline).forEach(timeline_value => {
    if (timeline_value.is_executed == true) return;
    timeline_value.data.map(item => {
      if (item.action_id == action_key) {
        _.TEMP_SCORE_DATA[item.type == 'mark_correct' ? 'current_correct' : 'current_incorrect']++;
        setSegmentScore();
        const element = getTrackScoreItemComponent(item.type);
        element.setImgType(item.type);
        element.setTitle(item.action_name);
        _.TRACK_PANEL_ITEM_WRAPPER?.appendChild(element.getElement());
        timeline_value.is_executed = true;
      }
    });
  });
}
