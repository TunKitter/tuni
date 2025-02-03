import { ElementWithTimelineInterfaceHandlerAndCloseFlow } from '../flows/element_with_timeline_interface_handler_and_close';
import { getPlayerOverlay } from '../overlay';
import { TimelineDataType } from '../types';
import _ from '../variables';
import TimelineInterface from './TimelineInterface';

export default class PointerTimelineInterfaceHandler extends TimelineInterface {
  private element: HTMLElement;
  private overlay: ReturnType<typeof getPlayerOverlay>;
  constructor(value: TimelineDataType) {
    super(value);
    this.element = document.createElement('div');
    this.element.className = 'tunkit_timeline_interface tunkit_timeline_pointer_interface';
    this.overlay = getPlayerOverlay();
    Object.entries(this.data.action).forEach(([key, value]) => {
      const btn = document.createElement('button');
      Object.assign(btn.style, {
        // @ts-ignore
        left: `${value.axis.x}%`,
        // @ts-ignore
        top: `${value.axis.y}%`,
      });
      btn.className = 'tunkit_gradient_button_copy_by_css_scan';
      btn.setAttribute('role', 'button');
      ElementWithTimelineInterfaceHandlerAndCloseFlow(btn, key, value, this);
      btn.innerText = value.name;
      this.element.appendChild(btn);
    });
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
  }
  show() {
    if (this.is_prevent_show) return;
    (_.PANEL_WRAPPER as HTMLElement)?.classList.remove('tunkit_menu_active');
    this.overlay.getElement().style.height = '100%';
    this.element.style.transform = 'scale(1)';
    this.is_showing = true;
  }

  hide() {
    this.overlay.getElement().style.height = '0';
    this.element.style.transform = 'scale(0)';
    this.is_showing = false;
  }
}
