import { getActionButtons } from '../components/action_buttons';
import { ElementWithTimelineInterfaceHandlerAndCloseFlow } from '../flows/element_with_timeline_interface_handler_and_close';
import { getPlayerOverlay } from '../overlay';
import { TimelineDataType } from '../types';
import { getComponent } from '../utils';
import _ from '../variables';
import TimelineInterface from './TimelineInterface';

export default class FlashcardTimelineInterface extends TimelineInterface {
  private element: HTMLElement;
  private overlay: ReturnType<typeof getPlayerOverlay>;
  private action: ReturnType<typeof getActionButtons>;
  constructor(value: TimelineDataType) {
    super(value);
    this.element = getComponent('.tunkit_timeline_interface.tunkit_timeline_flashcard_interface', false);
    this.element.querySelector('.tunkit_flashcard_front')!.textContent = this.data.data.front;
    this.element.querySelector('.tunkit_flashcard_back')!.textContent = this.data.data.back;
    this.overlay = getPlayerOverlay();
    this.action = getActionButtons();
    this.action.setActionData(this.data.action);
    const action_data = this.action.getActionData();
    Object.keys(action_data).forEach(
      key => void ElementWithTimelineInterfaceHandlerAndCloseFlow(action_data[key].element, action_data[key].data, this)
    );
  }
  getElement() {
    return this.element;
  }
  removeElement() {
    this.element.remove();
  }
  render() {
    _.VIDEO_PLAYER!.appendChild(this.element);
    this.overlay.getElement().style.height = '0';
    this.overlay.render();
    this.action.render();
  }
  show() {
    if (this.is_prevent_show) return;
    (_.PANEL_WRAPPER as HTMLElement)?.classList.remove('tunkit_menu_active');
    this.overlay.getElement().style.height = '100%';
    this.element.style.left = '0';
    this.showAction();
    this.is_showing = true;
  }
  showAction() {
    this.action.show();
  }
  hideAction() {
    this.action.hide();
  }
  hide() {
    this.overlay.getElement().style.height = '0';
    this.element.style.left = '-100%';
    this.hideAction();
    this.is_showing = false;
  }
}
