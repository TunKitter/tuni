import Timeline from '../models/Timeline';
import { TimelineType } from '../types';
import { getComponent, secondsToHms } from '../utils';
import _ from '../variables';

export function handleLoadTimeline() {
  const loader = _.PANEL_WRAPPER?.querySelector('#tunkit_loader.loader_note') as HTMLElement;
  loader.style.display = 'block';
  _.TIMELINE_PANEL_WRAPPER!.innerHTML = '';
  Object.keys(_.CURRENT_TEMPLATE_PANEL_ITEM!.getTimelineNotes()).forEach((key: string) => {
    console.log(key);
  });
  loader.style.display = 'none';
}
export function getTimelinePanelItem() {
  const timeline_panel = getComponent('.tunkit_timeline_panel_item') as HTMLElement;
  const timelineText = timeline_panel.querySelector('.timeline_panel_item_time_text')!;
  const timeline_name = timeline_panel.querySelector('.timeline_panel_item_name')!;
  const timeline_type = timeline_panel.querySelector('.timeline_panel_item_type')!;
  return {
    render() {
      _.TIMELINE_PANEL_WRAPPER?.appendChild(timeline_panel);
    },
    setTimelineText(start: number, end: number) {
      const text = `${secondsToHms(String(start))} — ${secondsToHms(String(end))}`;
      timelineText.textContent = text;
    },
    setName(name: string) {
      timeline_name.textContent = name;
    },
    setType(type: TimelineType) {
      timeline_type.textContent = Timeline.GETNAME[type];
    },
  };
}
