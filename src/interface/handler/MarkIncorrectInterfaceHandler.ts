import { ActionDataType } from '../../types';
import _ from '../../variables';

export default class MarkIncorrectActionHandler {
  private action_data: ActionDataType;
  private element: HTMLElement = document.createElement('div');
  constructor(action_data: ActionDataType) {
    this.action_data = action_data;
  }
  handle() {
    this.element.className = 'tunkit_player_correct_and_incorrect tunkit_flex_center tunkit_player_overlay_incorrect';
    this.element.innerText = 'Incorrect';
    _.VIDEO_PLAYER!.appendChild(this.element);
  }
  removeElement() {
    this.element.remove();
  }
}
