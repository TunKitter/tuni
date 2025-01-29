import { getDrawerPlayerComponent } from '../../components/drawer_player';
import { _getURL } from '../../utils';
import _ from '../../variables';

export default class NotificationInterfaceHandler {
  private element: ReturnType<typeof getDrawerPlayerComponent>;
  constructor(message: string) {
    const player_drawer = getDrawerPlayerComponent();
    this.element = player_drawer;
    player_drawer.setMessage(message);
    player_drawer.getElement().classList.add('tunkit_action_notification_handler');
  }
  getElement() {
    return this.element;
  }
  handle() {
    this.element.handle();
  }
}
