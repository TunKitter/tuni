import { getFlashcardTimelineDialog } from '../dialogs/flashcard_timeline_dialog';
import { getMessageTimelineDialog } from '../dialogs/message_timeline_dialog';
import { getTypingTimelineDialog, renderAnswerItem } from '../dialogs/typing_timeline_dialog';
import { ButtonAdderWithDialogActionFlow } from '../flows/button_adder_with_dialog';
import { DialogWithOverlayFlow } from '../flows/dialog_with_overlay';
import { InputTagSelectWithDialogFlow } from '../flows/input_tags_select_with_typing_dialog';
import Timeline from '../models/Timeline';
import { ActionDataType, ActionTypingDataType, TimelineDataType } from '../types';
import { getCurrentYoutubeId, getTimelineTextFormat, randomString } from '../utils';
import _ from '../variables';
import { handleLoadTemplate } from './panel_template';
import { getTimelinePanelItem, handleClickTimelineItemPanel, handleLoadTimeline } from './panel_timeline';

export function handleShowPanel(wrapper: HTMLElement, callback: Function | undefined = undefined) {
  wrapper.querySelectorAll('*[data-tunkit-panel]').forEach(element => {
    element.addEventListener('click', function () {
      if (callback !== undefined) {
        callback(element, function show() {
          // @ts-ignore
          showPanel('.tunkit_panel.panel_' + element.dataset.tunkitPanel, element.dataset.tunkitType);
        });
      }
    });
  });
}
export function handleChangeViewPanel() {
  handleShowPanel(_.PANEL_WRAPPER as HTMLElement, function (element: HTMLElement, show: Function) {
    if (getActivePanel() == false) return;
    switch (element.dataset.tunkitPanel) {
      case 'main': {
        show();
        break;
      }
      case 'template': {
        show();
        if (_.IS_GET_TEMPLATE) break;
        handleLoadTemplate();
        _.IS_GET_TEMPLATE = true;
        break;
      }
      case 'note': {
        if (_.CURRENT_TEMPLATE_ID) show();
        else break;
        if (_.IS_GET_TIMELINE) break;
        handleLoadTimeline();
        _.IS_GET_TIMELINE = true;
        break;
      }
      case 'create_message_timeline': {
        if (!_.CURRENT_TEMPLATE_ID) return;
        handleCreateMessageTimeline();
        break;
      }
      case 'create_flashcard_timeline': {
        if (!_.CURRENT_TEMPLATE_ID) return;
        handleCreateFlashcardTimeline();
        break;
      }
      case 'create_typing_timeline': {
        if (!_.CURRENT_TEMPLATE_ID) return;
        handleCreateTypingTimeline();
        break;
      }
    }
  });
}
export function showPanel(className: string, active_class: string, wrapper: HTMLElement | Document = document) {
  wrapper.querySelector('.' + active_class)?.classList?.remove(active_class);
  wrapper.querySelector(className)?.classList?.add(active_class);
}
export function handleToggleMenuSwitcherIcon() {
  (_.PANEL_WRAPPER?.querySelector('#tunkit_toggle_interactive_video') as HTMLElement)?.addEventListener(
    'click',
    function () {
      setActivePanel(!getActivePanel());
    }
  );
}
export function setActivePanel(status: boolean) {
  (_.PANEL_WRAPPER?.querySelector('#tunkit_toggle_interactive_video') as HTMLElement).setAttribute(
    'aria-checked',
    status ? 'true' : 'false'
  );
  (_.PANEL_WRAPPER?.querySelector('.tunkit_content') as HTMLElement).style.opacity = status ? '1' : '0.5';
}
export function getActivePanel(): boolean {
  return (
    (_.PANEL_WRAPPER?.querySelector('#tunkit_toggle_interactive_video') as HTMLElement).getAttribute('aria-checked') ==
    'true'
  );
}
export function setDisableItems(wrapper: HTMLElement, class_name: string, is_remove: boolean) {
  wrapper.querySelectorAll(class_name).forEach(element => {
    // @ts-ignore
    element.style.opacity = is_remove ? '0.5' : '1';
  });
}
export function setCurrentTemplate(text: string) {
  //@ts-ignore
  _.PANEL_WRAPPER?.querySelector('.tunkit_current_template').textContent = text;
}
export function setCurrentTotalNotes(notes_length: number | string) {
  //@ts-ignore
  _.PANEL_WRAPPER?.querySelector('.tunkit_total_notes').innerText =
    //@ts-ignore
    typeof notes_length == 'number' ? `${notes_length} note${notes_length > 1 ? 's' : ''}` : notes_length;
}
function handleCreateMessageTimeline() {
  const message_timeline_dialog = getMessageTimelineDialog();
  const dialog_flow = DialogWithOverlayFlow(message_timeline_dialog.BASE.getElement(), {
    close_selector: ['.tunkit_close_timeline'],
    overlay_z_index: 2201,
  });
  message_timeline_dialog.BASE.setTitle('Create message timeline');
  message_timeline_dialog.BASE.setStartTime(_.VIDEO!.currentTime);
  message_timeline_dialog.BASE.setEndTime(_.VIDEO!.currentTime + 5);
  message_timeline_dialog.BASE.getElement().querySelector('.delete_timeline_button')?.remove();
  const temp_action = {} as {
    [key: string]: ActionDataType;
  };
  ButtonAdderWithDialogActionFlow(temp_action, message_timeline_dialog);
  message_timeline_dialog.render();
  message_timeline_dialog.BASE.onClickSave(function () {
    const payload: TimelineDataType = {
      name: message_timeline_dialog.BASE.getName(),
      startTime: message_timeline_dialog.BASE.getStartTime(),
      endTime: message_timeline_dialog.BASE.getEndTime(),
      tags: message_timeline_dialog.BASE.INPUT_TAG.getData(),
      data: message_timeline_dialog.getDataTimeline(),
      action: temp_action,
      type: 'message',
      timeline: getTimelineTextFormat(
        message_timeline_dialog.BASE.getStartTime(),
        message_timeline_dialog.BASE.getEndTime()
      ),
    };
    Timeline.from(getCurrentYoutubeId())
      .withTemplate(_.CURRENT_TEMPLATE_ID as string)
      .insert(payload)
      .then(data => {
        if (data.status == 'success') {
          _.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes[data.id] = payload;
          const timeline_item = getTimelinePanelItem();
          timeline_item.setTimelineText(payload.startTime, payload.endTime);
          timeline_item.setName(payload.name);
          timeline_item.setType(payload.type);
          timeline_item.onClick(() => handleClickTimelineItemPanel(data.id, timeline_item));
          timeline_item.render();
          dialog_flow.removeDialog();
          dialog_flow.removeOverlay();
          _.IS_GET_TEMPLATE = false;
          setCurrentTotalNotes(Object.keys(_.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes).length);
        }
      });
  });
}
function handleCreateFlashcardTimeline() {
  const flashcard_timeline_dialog = getFlashcardTimelineDialog();
  const dialog_flow = DialogWithOverlayFlow(flashcard_timeline_dialog.BASE.getElement(), {
    close_selector: ['.tunkit_close_timeline'],
    overlay_z_index: 2201,
  });
  flashcard_timeline_dialog.BASE.setTitle('Create flashcard timeline');
  flashcard_timeline_dialog.BASE.setStartTime(_.VIDEO!.currentTime);
  flashcard_timeline_dialog.BASE.setEndTime(_.VIDEO!.currentTime + 5);
  flashcard_timeline_dialog.BASE.getElement().querySelector('.delete_timeline_button')?.remove();
  const temp_action = {} as {
    [key: string]: ActionDataType;
  };
  ButtonAdderWithDialogActionFlow(temp_action, flashcard_timeline_dialog);
  flashcard_timeline_dialog.render();
  flashcard_timeline_dialog.BASE.onClickSave(function () {
    const payload: TimelineDataType = {
      name: flashcard_timeline_dialog.BASE.getName(),
      startTime: flashcard_timeline_dialog.BASE.getStartTime(),
      endTime: flashcard_timeline_dialog.BASE.getEndTime(),
      tags: flashcard_timeline_dialog.BASE.INPUT_TAG.getData(),
      data: flashcard_timeline_dialog.getDataTimeline(),
      action: temp_action,
      type: 'flashcard',
      timeline: getTimelineTextFormat(
        flashcard_timeline_dialog.BASE.getStartTime(),
        flashcard_timeline_dialog.BASE.getEndTime()
      ),
    };
    Timeline.from(getCurrentYoutubeId())
      .withTemplate(_.CURRENT_TEMPLATE_ID as string)
      .insert(payload)
      .then(data => {
        if (data.status == 'success') {
          _.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes[data.id] = payload;
          const timeline_item = getTimelinePanelItem();
          timeline_item.setTimelineText(payload.startTime, payload.endTime);
          timeline_item.setName(payload.name);
          timeline_item.setType(payload.type);
          timeline_item.onClick(() => handleClickTimelineItemPanel(data.id, timeline_item));
          timeline_item.render();
          dialog_flow.removeDialog();
          dialog_flow.removeOverlay();
          _.IS_GET_TEMPLATE = false;
          setCurrentTotalNotes(Object.keys(_.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes).length);
        }
      });
  });
}
function handleCreateTypingTimeline() {
  const typing_timeline_dialog = getTypingTimelineDialog();
  typing_timeline_dialog.BASE.setTitle('Create typing timeline');
  typing_timeline_dialog.BASE.setStartTime(_.VIDEO!.currentTime);
  typing_timeline_dialog.BASE.setEndTime(_.VIDEO!.currentTime + 5);
  const dialog_flow = DialogWithOverlayFlow(typing_timeline_dialog.BASE.getElement(), {
    close_selector: ['.tunkit_close_timeline'],
    overlay_z_index: 2201,
  });
  const temp_action = {} as { [key: string]: ActionTypingDataType };
  InputTagSelectWithDialogFlow(temp_action, typing_timeline_dialog);
  typing_timeline_dialog.render();
  typing_timeline_dialog.BASE.onClickSave(function () {
    const payload: TimelineDataType = {
      name: typing_timeline_dialog.BASE.getName(),
      startTime: typing_timeline_dialog.BASE.getStartTime(),
      endTime: typing_timeline_dialog.BASE.getEndTime(),
      tags: typing_timeline_dialog.BASE.INPUT_TAG.getData(),
      data: { question: typing_timeline_dialog.getDataTimeline() },
      action: temp_action,
      type: 'typing',
      timeline: getTimelineTextFormat(
        typing_timeline_dialog.BASE.getStartTime(),
        typing_timeline_dialog.BASE.getEndTime()
      ),
    };
    Timeline.from(getCurrentYoutubeId())
      .withTemplate(_.CURRENT_TEMPLATE_ID as string)
      .insert(payload)
      .then(result => {
        if (result.status == 'success') {
          _.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes[result.id] = payload;
          const timeline_item = getTimelinePanelItem();
          timeline_item.setTimelineText(payload.startTime, payload.endTime);
          timeline_item.setName(payload.name);
          timeline_item.setType(payload.type);
          timeline_item.onClick(() => handleClickTimelineItemPanel(result.id, timeline_item));
          timeline_item.render();
          dialog_flow.removeDialog();
          dialog_flow.removeOverlay();
          _.IS_GET_TEMPLATE = false;
          setCurrentTotalNotes(Object.keys(_.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes).length);
        }
      });
  });
}
