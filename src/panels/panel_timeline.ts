import { ButtonAdderWithDialogActionFlow } from '../flows/button_adder_with_dialog';
import { ButtonAdderWithPointerDialogActionFlow } from '../flows/button_adder_with_pointer_dialog';
import { DialogWithOverlayFlow } from '../flows/dialog_with_overlay';
import { InputTagSelectWithDialogFlow } from '../flows/input_tags_select_with_typing_dialog';
import Tags from '../models/Tag';
import Timeline from '../models/Timeline';
import { removeAllInteractionElements } from '../navigate';
import { DialogTimelineTypeNavigator } from '../navigator/update_dialog_timeline_type_navigator';
import { TimelineDataType, TimelineType } from '../types';
import { getComponent, getCurrentYoutubeId, getTimelineTextFormat } from '../utils';
import _ from '../variables';
import { activeTimelineInVideo } from '../video';
import { getStateActiveTimelineInVideo, setCurrentTotalNotes } from './panel';
import { resetPanelScore } from './panel_track';

export function handleLoadTimeline() {
  const loader = _.PANEL_WRAPPER?.querySelector('#tunkit_loader.loader_note') as HTMLElement;
  loader.style.display = 'block';
  _.TIMELINE_PANEL_WRAPPER!.innerHTML = '';
  const timeline_data = _.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes;
  Object.keys(timeline_data).forEach((key: string) => {
    const timeline_component = getTimelinePanelItem();
    timeline_component.setName(timeline_data[key].name);
    timeline_component.setTimelineText(timeline_data[key].startTime, timeline_data[key].endTime);
    timeline_component.setType(timeline_data[key].type);
    timeline_component.onClick(() => handleClickTimelineItemPanel(key, timeline_component));
    timeline_component.render();
  });
  loader.style.display = 'none';
}
export function getTimelinePanelItem() {
  const timeline_panel = getComponent('.tunkit_timeline_panel_item', false) as HTMLElement;
  const timelineText = timeline_panel.querySelector('.timeline_panel_item_time_text')!;
  const timeline_name = timeline_panel.querySelector('.timeline_panel_item_name')!;
  const timeline_type = timeline_panel.querySelector('.timeline_panel_item_type')!;
  return {
    render() {
      _.TIMELINE_PANEL_WRAPPER?.appendChild(timeline_panel);
    },
    setTimelineText(start: number, end: number) {
      const text = getTimelineTextFormat(start, end);
      //@ts-ignore
      timeline_panel.querySelector('.timeline_panel_item_time_text')!.onclick = function (e) {
        e.stopPropagation();
        _.VIDEO!.currentTime = start;
      };
      timelineText.textContent = text;
    },
    setName(name: string) {
      timeline_name.textContent = name;
    },
    setType(type: TimelineType) {
      timeline_type.textContent = Timeline.GETNAME[type];
    },
    onClick(callback: Function) {
      // @ts-ignore
      timeline_panel.onclick = () => callback();
    },
    getElement: () => timeline_panel,
  };
}

function handleClickMessageTimeline(timeline_dialog: any, data_timeline: any) {
  timeline_dialog.setDataTimeline(data_timeline.data);
  const temp_action = JSON.parse(JSON.stringify(data_timeline.action));
  ButtonAdderWithDialogActionFlow(temp_action, timeline_dialog);
  return function () {
    return {
      data: timeline_dialog.getDataTimeline(),
      action: temp_action,
      type: data_timeline.type,
    };
  };
}
function handleClickTypingTimeline(timeline_dialog: any, data_timeline: any) {
  timeline_dialog.setDataTimeline(data_timeline.data.question);
  const temp_action = JSON.parse(JSON.stringify(data_timeline.action));
  InputTagSelectWithDialogFlow(temp_action, timeline_dialog);
  return function () {
    return {
      data: { question: timeline_dialog.getDataTimeline() },
      action: temp_action,
      type: 'typing',
    };
  };
}
function handleClickPointerTimeline(timeline_dialog: any, data_timeline: any) {
  const temp_action = JSON.parse(JSON.stringify(data_timeline.action));
  ButtonAdderWithPointerDialogActionFlow(temp_action, timeline_dialog);
  return function () {
    return {
      data: {},
      action: temp_action,
      type: 'pointer',
    };
  };
}
export async function handleClickTimelineItemPanel(key: string, timeline_component: any) {
  const data_timeline = _.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes[key];
  const timeline_dialog = DialogTimelineTypeNavigator(data_timeline.type)!;
  timeline_dialog.BASE.setTitle(`Update ${data_timeline.type} timeline`);
  timeline_dialog.BASE.setName(data_timeline.name);
  timeline_dialog.BASE.setStartTime(data_timeline.startTime);
  timeline_dialog.BASE.setEndTime(data_timeline.endTime);
  const tags = await Tags.DATA.GET_TAGS_VALUES(data_timeline.tags);
  timeline_dialog.BASE.INPUT_TAG.setData(tags);
  const dialog_flow = DialogWithOverlayFlow(timeline_dialog.BASE.getElement(), {
    close_selector: ['.tunkit_close_timeline'],
    overlay_z_index: 2201,
  });
  let data_return = {} as any;
  switch (data_timeline.type) {
    case 'message':
    case 'flashcard': {
      data_return = handleClickMessageTimeline(timeline_dialog, data_timeline);
      break;
    }
    case 'typing': {
      data_return = handleClickTypingTimeline(timeline_dialog, data_timeline);
      break;
    }
    case 'pointer': {
      data_return = handleClickPointerTimeline(timeline_dialog, data_timeline);
      break;
    }
  }

  timeline_dialog.render();

  timeline_dialog.BASE.onClickDelete(function () {
    if (confirm('Are you sure to delete this timeline note?')) {
      Timeline.from(getCurrentYoutubeId())
        .withTemplate(_.CURRENT_TEMPLATE_ID as string)
        .remove(key)
        .then(data => {
          if (data.status == 'success') {
            delete _.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes[key];
            timeline_component.getElement().remove();
            _.IS_GET_TEMPLATE = false;
            setCurrentTotalNotes(Object.keys(_.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes).length);
            dialog_flow.removeDialog();
            dialog_flow.removeOverlay();
            removeAllInteractionElements();
            activeTimelineInVideo(getStateActiveTimelineInVideo());
            resetPanelScore();
          }
        });
    }
  });
  timeline_dialog.BASE.onClickSave(async function () {
    //@ts-ignore
    if (!timeline_dialog.validateData()) return;
    if (data_timeline.type == 'pointer' && Object.keys(data_return().action).length == 0)
      return void alert('It must have at least one action.');

    const tags = await Tags.DATA.GET_TAGS_KEYS(timeline_dialog.BASE.INPUT_TAG.getData());
    let pre_payload: TimelineDataType = {
      name: timeline_dialog.BASE.getName(),
      startTime: timeline_dialog.BASE.getStartTime(),
      endTime: timeline_dialog.BASE.getEndTime(),
      tags: tags,
      data: 'nothing',
      action: {},
      type: 'message',
      timeline: getTimelineTextFormat(timeline_dialog.BASE.getStartTime(), timeline_dialog.BASE.getEndTime()),
    };
    const payload = { ...pre_payload, ...data_return() };
    if (payload.type == 'typing') {
      const temp_action = payload.action;
      const id_otherwise = Object.keys(temp_action).find(e => temp_action[e].select_type == 'otherwise');
      if (!id_otherwise) {
        alert('It must have one "otherwise" action.');
        return;
      }
      temp_action[id_otherwise].include = [];
    }
    Timeline.from(getCurrentYoutubeId())
      .withTemplate(_.CURRENT_TEMPLATE_ID as string)
      .update(key, payload)
      .then(data => {
        if (data.status == 'success') {
          timeline_component.setTimelineText(payload.startTime, payload.endTime);
          timeline_component.setName(payload.name);
          _.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes[key] = payload;
          dialog_flow.removeDialog();
          dialog_flow.removeOverlay();
          removeAllInteractionElements();
          activeTimelineInVideo(getStateActiveTimelineInVideo());
          resetPanelScore();
        }
      });
  });
}
