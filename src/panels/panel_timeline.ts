import { ButtonAdderWithDialogActionFlow } from '../flows/button_adder_with_dialog';
import { DialogWithOverlayFlow } from '../flows/dialog_with_overlay';
import Timeline from '../models/Timeline';
import { DialogTimelineTypeNavigator } from '../navigator/update_dialog_timeline_type_navigator';
import { TimelineDataType, TimelineType } from '../types';
import { getComponent, getCurrentYoutubeId, getTimelineTextFormat } from '../utils';
import _ from '../variables';
import { setCurrentTotalNotes } from './panel';

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

export function handleClickTimelineItemPanel(key: string, timeline_component: any) {
  const data_timeline = _.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes[key];
  const timeline_dialog = DialogTimelineTypeNavigator(data_timeline.type)!;
  const dialog_flow = DialogWithOverlayFlow(timeline_dialog.BASE.getElement(), {
    close_selector: ['.tunkit_close_timeline'],
    overlay_z_index: 2201,
  });
  timeline_dialog.BASE.setTitle('Update message timeline');
  timeline_dialog.BASE.setName(data_timeline.name);
  timeline_dialog.BASE.setStartTime(data_timeline.startTime);
  timeline_dialog.BASE.setEndTime(data_timeline.endTime);
  timeline_dialog.BASE.INPUT_TAG.setData(data_timeline.tags);
  timeline_dialog.setDataTimeline(data_timeline.data);
  const temp_action = JSON.parse(JSON.stringify(data_timeline.action));
  ButtonAdderWithDialogActionFlow(temp_action, timeline_dialog);
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
          }
        });
    }
  });
  timeline_dialog.BASE.onClickSave(function () {
    const payload: TimelineDataType = {
      name: timeline_dialog.BASE.getName(),
      startTime: timeline_dialog.BASE.getStartTime(),
      endTime: timeline_dialog.BASE.getEndTime(),
      tags: timeline_dialog.BASE.INPUT_TAG.getData(),
      data: timeline_dialog.getDataTimeline(),
      action: temp_action,
      type: data_timeline.type,
      timeline: getTimelineTextFormat(timeline_dialog.BASE.getStartTime(), timeline_dialog.BASE.getEndTime()),
    };
    Timeline.from(getCurrentYoutubeId())
      .withTemplate(_.CURRENT_TEMPLATE_ID as string)
      .update(key, payload)
      .then(data => {
        if (data.status == 'success') {
          timeline_component.setTimelineText(payload.startTime, payload.endTime);
          timeline_component.setName(payload.name);
          timeline_component.setType(payload.type);
          _.TIMELINE_NOTE[_.CURRENT_TEMPLATE_ID as string].timelineNotes[key] = payload;
          dialog_flow.removeDialog();
          dialog_flow.removeOverlay();
        }
      });
  });
}
