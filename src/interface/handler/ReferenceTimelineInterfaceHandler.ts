import { getDrawerPlayerComponent } from '../../components/drawer_player';
import Template from '../../models/Template';

export default class ReferenceTimelineInterfaceHandler {
  private element: ReturnType<typeof getDrawerPlayerComponent>;
  private data: { youtube_id: string; template_id: string; timeline_id: string };
  constructor(data: { youtube_id: string; template_id: string; timeline_id: string }) {
    this.data = data;
    const player_drawer = getDrawerPlayerComponent();
    this.element = player_drawer;
    this.element.getElement().classList.add('tunkit_action_reference_handler');
    //@ts-ignore
    this.element.getElement().querySelector('.tunkit_toggle_action_interface img')?.style.filter = 'hue-rotate(210deg)';
  }
  getElement() {
    return this.element;
  }
  handle() {
    const youtubeID = this.data.youtube_id.substring(3);
    Template.from(youtubeID)
      .get(this.data.template_id)
      .then(result => {
        const timeline = result?.timelineNotes?.[this.data.timeline_id];
        if (!timeline) throw new Error('Timeline not found');
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.src = `https://www.youtube.com/embed/${youtubeID}?start=${timeline.startTime}&end=${timeline.endTime}`;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.style.height = '70%';
        this.element.setContent(iframe.outerHTML, true);
        this.element.handle();
      });
  }
}
