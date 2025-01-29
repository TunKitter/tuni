import { getDrawerPlayerComponent } from '../../components/drawer_player';
import _ from '../../variables';

export default class JumpTimelineInterfaceHandler {
  private data: { message: string; timeline: number };
  private element: ReturnType<typeof getDrawerPlayerComponent>;
  constructor(data: { message: string; timeline: number }) {
    this.data = data;
    this.element = getDrawerPlayerComponent();
    this.element.getElement().classList.add('tunkit_action_jump_timeline_handler');
    //@ts-ignore
    this.element.getElement().querySelector('.tunkit_toggle_action_interface img')?.style.filter = 'hue-rotate(210deg)';
    this.element.setMessage(this.data.message);
  }
  getDrawerElement: () => ReturnType<typeof getDrawerPlayerComponent> = () => this.element;
  handle() {
    (_.VIDEO as HTMLVideoElement).currentTime = this.data.timeline;
    _.VIDEO!.play();
    this.element.handle();
  }
}
