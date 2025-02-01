import { ElementWithTimelineInterfaceHandlerAndCloseFlow } from '../flows/element_with_timeline_interface_handler_and_close';
import { getPlayerOverlay } from '../overlay';
import { ActionTypingDataType, TimelineDataType } from '../types';
import { getComponent, isForcePauseVideo } from '../utils';
import _ from '../variables';
import TimelineInterface from './TimelineInterface';

export default class TypingTimelineInterface extends TimelineInterface {
  private element: HTMLElement;
  private overlay: ReturnType<typeof getPlayerOverlay>;
  constructor(value: TimelineDataType) {
    super(value);
    this.element = getComponent('.tunkit_action_typing_interface', false);
    this.handleClickCancel();
    this.handleEventOnInput();
    this.handleClickSubmit();
    this.overlay = getPlayerOverlay();
  }
  private handleClickSubmit() {
    const _this = this;
    this.element.querySelector('.tunkit_button_typing_submit')?.addEventListener('click', function () {
      const input_value = (_this.element.querySelector('.tunkit_input_timeline_typing') as HTMLInputElement).value;
      let is_match = false;
      let otherwise_key = '';
      Object.entries(_this.data.action).forEach(([key, value]) => {
        if ((value as ActionTypingDataType).select_type === 'otherwise') otherwise_key = key;
        //@ts-ignore
        if (value.include.includes(input_value)) {
          is_match = true;
          _this.hide();
          ElementWithTimelineInterfaceHandlerAndCloseFlow(null, value, null);
        }
      });
      if (!is_match) {
        if (otherwise_key == '') throw new Error('Not found otherwise key');
        ElementWithTimelineInterfaceHandlerAndCloseFlow(null, _this.data.action[otherwise_key], null);
      }
      isForcePauseVideo(false);
      _this.setPreventShow(true);
      (_this.element.querySelector('.tunkit_input_timeline_typing') as HTMLInputElement).value = '';
      _this.hide();
      _.VIDEO!.play();
    });
  }
  private handleEventOnInput() {
    const _this = this;
    this.element.querySelector('.tunkit_input_timeline_typing')?.addEventListener('keydown', function (e) {
      e.stopPropagation();
      isForcePauseVideo(true, _this.data.startTime);
    });
  }
  private handleClickCancel() {
    const _this = this;
    this.element.querySelector('.tunkit_button_typing_cancel')?.addEventListener('click', function () {
      _this.setPreventShow(true);
      isForcePauseVideo(false);
      (_this.element.querySelector('.tunkit_input_timeline_typing') as HTMLInputElement).blur();
      (_this.element.querySelector('.tunkit_input_timeline_typing') as HTMLInputElement).value = '';
      _this.hide();
      (_.VIDEO as HTMLVideoElement).play();
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
    this.element.style.left = '0';
    this.is_showing = true;
    (this.element.querySelector('.tunkit_input_timeline_typing') as HTMLInputElement).focus();
  }

  hide() {
    if (_.VIDEO!.currentTime < this.data.startTime || _.VIDEO!.currentTime > this.data.endTime) {
      this.setPreventShow(false);
      isForcePauseVideo(false);
      (this.element.querySelector('.tunkit_input_timeline_typing') as HTMLInputElement).value = '';
    }
    this.overlay.getElement().style.height = '0';
    this.element.style.left = '-100%';
    this.is_showing = false;
  }
}
